import Button from "@/components/ui/Button";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Accordion from "@/components/ui/Accordion";
import SanityPortableText from "./SanityPortableText";
import SectionShell from "./SectionShell";
import { sanityImageUrl } from "@/sanity/lib/image";
import type {
  CtaSection,
  FaqSection,
  FeatureGridSection,
  GallerySection,
  RichTextSection,
  SanityLink,
  SplitContentSection,
} from "@/sanity/types";

function LinkedButton({ action, dark = false }: { action?: SanityLink; dark?: boolean }) {
  if (!action) return null;
  return (
    <Button
      href={action.href}
      external={action.external}
      variant={dark ? "outlineLight" : "quiet"}
      size="sm"
      withArrow
    >
      {action.label}
    </Button>
  );
}

export function RichTextBlock({ section }: { section: RichTextSection }) {
  const dark = section.tone === "brown";
  return (
    <SectionShell tone={section.tone} anchor={section.anchor}>
      <div
        className={`${section.width === "standard" ? "max-w-5xl" : "max-w-3xl"} ${
          section.align === "center" ? "mx-auto text-center" : ""
        }`}
      >
        {(section.title || section.eyebrow) && (
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title || ""}
            subtitle={section.subtitle}
            align={section.align}
            tone={dark ? "dark" : "light"}
            className="mb-10"
          />
        )}
        <SanityPortableText value={section.body} tone={dark ? "dark" : "light"} />
      </div>
    </SectionShell>
  );
}

export function SplitContentBlock({ section }: { section: SplitContentSection }) {
  const src = sanityImageUrl(section.image);
  if (!src) return null;
  const dark = section.tone === "brown";
  const imageFirst = section.imageSide !== "right";

  return (
    <SectionShell tone={section.tone} anchor={section.anchor}>
      <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <Reveal
          variant="image"
          className={`lg:col-span-5 ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
        >
          <Img
            src={src}
            alt={section.image.alt}
            aspect="portrait"
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </Reveal>
        <div className={`lg:col-span-7 ${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            align="left"
            tone={dark ? "dark" : "light"}
            className="mb-10"
          />
          <SanityPortableText value={section.body} tone={dark ? "dark" : "light"} />
          {section.action && (
            <div className="mt-9">
              <LinkedButton action={section.action} dark={dark} />
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  );
}

const gridColumns = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 lg:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
} as const;

export function FeatureGridBlock({ section }: { section: FeatureGridSection }) {
  const dark = section.tone === "brown";
  return (
    <SectionShell tone={section.tone} anchor={section.anchor}>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        tone={dark ? "dark" : "light"}
      />
      <div className={`mt-14 grid gap-px bg-hairline ${gridColumns[section.columns || 3]}`}>
        {section.items.map((item, index) => {
          const src = sanityImageUrl(item.image);
          return (
            <Reveal key={item._key} delay={index * 60} className={dark ? "bg-ink-brown" : "bg-paper"}>
              <article className="h-full p-7 lg:p-9">
                {src && item.image && (
                  <Img
                    src={src}
                    alt={item.image.alt}
                    aspect="landscape"
                    rounded="rounded-brand"
                    className="mb-7"
                  />
                )}
                <h3 className={`font-sans text-h4 ${dark ? "text-white" : "text-ink"}`}>
                  {item.title}
                </h3>
                {item.text && (
                  <p className={`mt-4 font-sans text-body leading-body ${dark ? "text-white/65" : "text-text-secondary"}`}>
                    {item.text}
                  </p>
                )}
                {item.action && <LinkedButton action={item.action} dark={dark} />}
              </article>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}

export function GalleryBlock({ section }: { section: GallerySection }) {
  const dark = section.tone === "brown";
  return (
    <SectionShell tone={section.tone} anchor={section.anchor}>
      <SectionHeading
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        tone={dark ? "dark" : "light"}
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.images.map((image, index) => {
          const src = sanityImageUrl(image);
          if (!src) return null;
          return (
            <Reveal key={image._key || `${section._key}-${index}`} delay={index * 50} variant="image">
              <Img src={src} alt={image.alt} aspect="square" sizes="(max-width: 640px) 100vw, 34vw" />
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}

export function FaqBlock({ section }: { section: FaqSection }) {
  const dark = section.tone === "dark";
  return (
    <SectionShell tone={dark ? "brown" : "paper"} anchor={section.anchor}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            align="left"
            tone={dark ? "dark" : "light"}
          />
        </div>
        <div className="lg:col-span-7">
          <Accordion
            tone={dark ? "dark" : "light"}
            items={section.items.map((item) => ({
              id: item._key,
              question: item.question,
              answer: <SanityPortableText value={item.answer} tone={dark ? "dark" : "light"} />,
            }))}
          />
        </div>
      </div>
    </SectionShell>
  );
}

export function CtaBlock({ section }: { section: CtaSection }) {
  const dark = section.tone === "brown";
  const tone = section.tone === "lime" ? "lime" : section.tone === "blush" ? "blush" : "brown";
  return (
    <SectionShell tone={tone} anchor={section.anchor}>
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.text}
          tone={dark ? "dark" : "light"}
        />
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            href={section.primaryAction.href}
            external={section.primaryAction.external}
            variant={dark ? "light" : "primary"}
            size="lg"
            withArrow
          >
            {section.primaryAction.label}
          </Button>
          {section.secondaryAction && (
            <Button
              href={section.secondaryAction.href}
              external={section.secondaryAction.external}
              variant={dark ? "outlineLight" : "outline"}
              size="lg"
            >
              {section.secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
