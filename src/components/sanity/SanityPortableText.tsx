import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Img from "@/components/ui/Img";
import SectionTableFigure, { SECTION_TONES } from "@/components/treatment/SectionTableFigure";
import { blockAlignment } from "@/sanity/lib/alignment";
import { sanityImageRatio, sanityImageUrl } from "@/sanity/lib/image";
import type { SanityImage } from "@/sanity/types";

type SanityTable = {
  caption?: string;
  columns?: string[];
  rows?: Array<{ cells?: string[] }>;
  labelFirstColumn?: boolean;
};

/**
 * The alignment set with Studio's alignment buttons (see
 * src/sanity/portableText/align.tsx). Justified text stays left-aligned on
 * phones, where a narrow column justifies into gaps between words, and is
 * hyphenated above that to keep the gaps small.
 */
const ALIGN_CLASS = {
  alignLeft: "",
  alignCenter: "text-center",
  alignRight: "text-right",
  alignJustify: "hyphens-auto sm:text-justify",
} as const;
const alignClass = (value: unknown) => ALIGN_CLASS[blockAlignment(value)];
const noop = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

type KeyedImage = SanityImage & { _key: string };
type ImageGrid = { _type: "imageGrid"; _key: string; images: KeyedImage[] };
type IconList = {
  _type: "iconList";
  _key: string;
  items: Array<{ icon: KeyedImage; label: PortableTextBlock & { style?: string } }>;
};

const isImage = (block: PortableTextBlock | undefined) => block?._type === "imageWithAlt";
const isHeading = (block: PortableTextBlock | undefined) =>
  block?._type === "block" && /^h\d$/.test((block as { style?: string }).style ?? "");
const plainText = (block: PortableTextBlock) =>
  ((block as { children?: Array<{ text?: string }> }).children ?? []).map((c) => c.text ?? "").join("");

/**
 * Turns two layouts the clinic's WordPress articles had, and Studio has no
 * block for, into something the page can draw:
 *
 *  - **Pictures in a row → a grid.** A set of before/after photos was a
 *    gallery, four across; one picture per row turned the Botox articles'
 *    six into a column five screens tall.
 *  - **Picture, heading, picture, heading… → an icon list.** "What can be
 *    treated" was six small icons, each over a short label. Stored as it
 *    was built on staging (icon, then its label as a heading), each icon
 *    otherwise fills the column and each label reads as a section heading
 *    with nothing under it. Prose never has this shape: a heading is
 *    followed by its paragraph, so two such pairs can't sit back to back.
 */
function groupBlocks(value: PortableTextBlock[]): Array<PortableTextBlock | ImageGrid | IconList> {
  const out: Array<PortableTextBlock | ImageGrid | IconList> = [];
  for (let i = 0; i < value.length; ) {
    let pairs = 0;
    while (isImage(value[i + 2 * pairs]) && isHeading(value[i + 2 * pairs + 1])) pairs += 1;
    if (pairs >= 2) {
      const items = Array.from({ length: pairs }, (_, n) => ({
        icon: value[i + 2 * n] as unknown as KeyedImage,
        label: value[i + 2 * n + 1],
      }));
      out.push({ _type: "iconList", _key: `${value[i]._key}-icons`, items });
      i += 2 * pairs;
      continue;
    }
    const block = value[i];
    const previous = out[out.length - 1];
    const image = block as unknown as KeyedImage;
    if (!isImage(block) || !previous) out.push(block);
    else if (previous._type === "imageGrid") (previous as ImageGrid).images.push(image);
    else if (previous._type === "imageWithAlt") {
      const first = previous as unknown as KeyedImage;
      out[out.length - 1] = { _type: "imageGrid", _key: `${first._key}-grid`, images: [first, image] };
    } else out.push(block);
    i += 1;
  }
  return out;
}

function RichImage({ image, sizes }: { image: SanityImage; sizes: string }) {
  const src = sanityImageUrl(image);
  if (!src) return null;
  return (
    <figure>
      {/* Whole by default, the same rule as a treatment section's
          figure; 4:3 only when "Show the whole image" is turned off. */}
      <Img
        src={src}
        alt={image.alt}
        aspect="landscape"
        ratio={image.uncropped === false ? undefined : sanityImageRatio(image)}
        sizes={sizes}
      />
      {image.caption && (
        <figcaption className="mt-3 font-sans text-caption text-muted">{image.caption}</figcaption>
      )}
    </figure>
  );
}

const makeComponents = (tone: "light" | "dark"): PortableTextComponents => ({
  block: {
    normal: ({ children, value }) => <p className={alignClass(value) || undefined}>{children}</p>,
    // The "Paragraph (justified)" style that briefly preceded the buttons.
    // No document used it, but a Studio tab opened before the change could
    // still have written one.
    justify: ({ children }) => <p className={ALIGN_CLASS.alignJustify}>{children}</p>,
    h2: ({ children, value }) => (
      <h2 className={`font-script text-h2 leading-heading text-primary ${alignClass(value)}`}>
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 className={`font-sans text-h3 font-light leading-heading text-ink ${alignClass(value)}`}>
        {children}
      </h3>
    ),
    blockquote: ({ children, value }) => (
      <blockquote
        className={`border-l-2 border-primary/40 pl-6 font-sans text-lead text-text ${alignClass(value)}`}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    // A nested sub-list (level 2+, e.g. the special offers' price
    // breakdowns) gets a hollow circle instead of a filled disc, the
    // usual way of showing a bullet list has a level under it. Bullet
    // text uses the same size as surrounding prose, so offer conditions
    // and price requirements remain comfortably readable.
    bullet: ({ children, value }) => (
      <ul
        className={`space-y-2 pl-6 text-body leading-body ${
          typeof value?.level === "number" && value.level > 1
            ? "[list-style-type:circle]"
            : "list-disc"
        }`}
      >
        {children}
      </ul>
    ),
    number: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    // The alignment marks do their work on the paragraph, above.
    alignLeft: noop,
    alignCenter: noop,
    alignRight: noop,
    alignJustify: noop,
    textLink: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      // No underline, by request: the link is told apart by its colour and a
      // heavier weight, and darkens on hover. Dark bands recolour it with
      // `[&_a]:text-gold-soft` on the section, which outranks this class.
      const className =
        "font-semibold text-link transition-colors hover:text-link-hover";

      if (href.startsWith("/")) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className={className}
          target={value?.blank ? "_blank" : undefined}
          rel={value?.blank ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }) => (
      <RichImage image={value as SanityImage} sizes="(max-width: 768px) 100vw, 760px" />
    ),
    // Made by groupBlocks, never stored. Two across on a phone; on wider
    // screens three, or two when that leaves no row with a gap (2 and 4).
    imageGrid: ({ value }) => {
      const { images } = value as ImageGrid;
      const columns = images.length === 2 || images.length === 4 ? "" : "sm:grid-cols-3";
      return (
        <div className={`grid grid-cols-2 items-start gap-3 ${columns}`}>
          {images.map((image) => (
            <RichImage key={image._key} image={image} sizes="(max-width: 640px) 50vw, 384px" />
          ))}
        </div>
      );
    },
    // Also made by groupBlocks. Staging's sizes: a 64px icon over a centred
    // label, three across. The icon is decorative here, since the label
    // under it says the same thing, so screen readers skip it. The label
    // keeps its heading level, and pt-0! beats the wrapper's spacing above
    // headings, which is meant for section headings.
    iconList: ({ value }) => {
      const { items } = value as IconList;
      return (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-8 py-2 sm:grid-cols-3">
          {items.map(({ icon, label }) => {
            const src = sanityImageUrl(icon);
            const Label = (["h2", "h3", "h4"].includes(label.style ?? "") ? label.style : "h3") as "h3";
            return (
              <li key={icon._key} className="flex flex-col items-center text-center">
                {src && (
                  <div className="w-16">
                    <Img src={src} alt="" ratio={sanityImageRatio(icon) ?? 1} rounded="" background="" sizes="64px" />
                  </div>
                )}
                <Label className="mt-4 pt-0! font-sans text-body font-medium leading-heading text-primary-strong">
                  {plainText(label)}
                </Label>
              </li>
            );
          })}
        </ul>
      );
    },
    // A blog article's table. The same component, and so the same phone
    // layout, as a comparison table on a treatment page — see
    // SectionTableFigure for why it reflows rather than scrolls.
    treatmentTable: ({ value }) => {
      const table = value as SanityTable;
      return (
        <SectionTableFigure
          table={{
            kind: "table",
            caption: table.caption,
            columns: table.columns ?? [],
            rows: (table.rows ?? []).map((row) => row.cells ?? []),
            labelFirstColumn: table.labelFirstColumn ?? true,
          }}
          tone={tone === "dark" ? SECTION_TONES.brown : SECTION_TONES.plain}
          className="py-2"
        />
      );
    },
  },
});

const COMPONENTS = { light: makeComponents("light"), dark: makeComponents("dark") };

export default function SanityPortableText({
  value,
  tone = "light",
  smallPrint = false,
  className = "",
  spacing = "space-y-6",
}: {
  value?: PortableTextBlock[];
  tone?: "light" | "dark";
  /**
   * Gap between blocks. A prop rather than something `className` can
   * override, because `space-y-*` utilities have equal specificity — a
   * second one passed in wins or loses on stylesheet order, which is not
   * something a call site should have to reason about. The treatment page
   * passes space-y-4 to match the gap its plain paragraphs had, so moving
   * copy into rich text changes nothing on screen.
   */
  spacing?: string;
  /** Extra classes on the wrapper — the treatment page uses it to hold
   *  its prose to the same measure as the paragraphs it replaced. */
  className?: string;
  /** Downsizes an italic-only exclusion note within a richer offer card. */
  smallPrint?: boolean;
}) {
  if (!value?.length) return null;
  return (
    <div
      className={`${spacing} font-sans text-body leading-body [&_h2:not(:first-child)]:pt-8 [&_h3:not(:first-child)]:pt-5 ${
        smallPrint ? "[&_p:has(>em:only-child)]:text-caption [&_p:has(>em:only-child)]:leading-body" : ""
      } ${
        tone === "dark" ? "text-white/70" : "text-text-secondary"
      } ${className}`}
    >
      <PortableText value={groupBlocks(value)} components={COMPONENTS[tone]} />
    </div>
  );
}
