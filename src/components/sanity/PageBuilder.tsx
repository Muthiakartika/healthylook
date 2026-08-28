import { Fragment } from "react";
import SanityHeroSection from "./SanityHeroSection";
import CuratedSection from "./CuratedSection";
import DynamicCollectionSection from "./DynamicCollectionSection";
import {
  CtaBlock,
  FaqBlock,
  FeatureGridBlock,
  GalleryBlock,
  RichTextBlock,
  SplitContentBlock,
} from "./ContentSections";
import type { PageSection } from "@/sanity/types";

async function renderSection(section: PageSection) {
  switch (section._type) {
    case "heroSection":
      return <SanityHeroSection section={section} />;
    case "richTextSection":
      return <RichTextBlock section={section} />;
    case "splitContentSection":
      return <SplitContentBlock section={section} />;
    case "featureGridSection":
      return <FeatureGridBlock section={section} />;
    case "gallerySection":
      return <GalleryBlock section={section} />;
    case "faqSection":
      return <FaqBlock section={section} />;
    case "ctaSection":
      return <CtaBlock section={section} />;
    case "collectionSection":
      return <DynamicCollectionSection section={section} />;
    case "curatedSection":
      return <CuratedSection section={section} />;
    default:
      return null;
  }
}

export default async function PageBuilder({ sections }: { sections: PageSection[] }) {
  const visible = sections.filter((section) => !section.isHidden);
  const rendered = await Promise.all(
    visible.map(async (section) => ({
      key: section._key,
      node: await renderSection(section),
    })),
  );

  return <>{rendered.map(({ key, node }) => <Fragment key={key}>{node}</Fragment>)}</>;
}
