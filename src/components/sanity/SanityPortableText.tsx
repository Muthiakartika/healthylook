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

type ImageGrid = { _type: "imageGrid"; _key: string; images: Array<SanityImage & { _key: string }> };

/**
 * Two or more pictures in a row become one grid. The clinic's WordPress
 * articles showed a set of before/after photos as a gallery, four across;
 * one picture per row turned the Botox articles' six into a column five
 * screens tall. Studio has no gallery block to choose, so pictures placed
 * one after another are taken to be one.
 */
function groupImages(value: PortableTextBlock[]): Array<PortableTextBlock | ImageGrid> {
  const out: Array<PortableTextBlock | ImageGrid> = [];
  for (const block of value) {
    const previous = out[out.length - 1];
    const image = block as unknown as SanityImage & { _key: string };
    if (block._type !== "imageWithAlt" || !previous) out.push(block);
    else if (previous._type === "imageGrid") (previous as ImageGrid).images.push(image);
    else if (previous._type === "imageWithAlt") {
      const first = previous as unknown as SanityImage & { _key: string };
      out[out.length - 1] = { _type: "imageGrid", _key: `${first._key}-grid`, images: [first, image] };
    } else out.push(block);
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
      const className =
        "font-medium text-primary-strong underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover";

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
    // Made by groupImages, never stored. Two across on a phone; on wider
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
      <PortableText value={groupImages(value)} components={COMPONENTS[tone]} />
    </div>
  );
}
