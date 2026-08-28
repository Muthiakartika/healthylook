import { category } from "./documents/category";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { siteSettings } from "./documents/siteSettings";
import { treatment } from "./documents/treatment";
import { doctor } from "./documents/doctor";
import { testimonial } from "./documents/testimonial";
import { faqItem } from "./objects/faqItem";
import { featureItem } from "./objects/featureItem";
import { imageWithAlt } from "./objects/imageWithAlt";
import { link } from "./objects/link";
import { portableText } from "./objects/portableText";
import { seo } from "./objects/seo";
import { priceRow } from "./objects/priceRow";
import { priceGroup } from "./objects/priceGroup";
import { treatmentContentBlock, treatmentSection } from "./objects/treatmentSection";
import { ctaSection } from "./objects/sections/ctaSection";
import { collectionSection } from "./objects/sections/collectionSection";
import { curatedSection } from "./objects/sections/curatedSection";
import { faqSection } from "./objects/sections/faqSection";
import { featureGridSection } from "./objects/sections/featureGridSection";
import { gallerySection } from "./objects/sections/gallerySection";
import { heroSection } from "./objects/sections/heroSection";
import { richTextSection } from "./objects/sections/richTextSection";
import { splitContentSection } from "./objects/sections/splitContentSection";

export const schemaTypes = [
  // Shared objects
  imageWithAlt,
  link,
  portableText,
  seo,
  faqItem,
  featureItem,
  priceRow,
  priceGroup,
  treatmentContentBlock,
  treatmentSection,

  // Controlled page-builder sections
  heroSection,
  richTextSection,
  splitContentSection,
  featureGridSection,
  gallerySection,
  faqSection,
  ctaSection,
  collectionSection,
  curatedSection,

  // Documents
  page,
  post,
  category,
  treatment,
  doctor,
  testimonial,
  siteSettings,
];
