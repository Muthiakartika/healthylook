import type { Metadata } from "next";
import CmsPage from "@/components/sanity/CmsPage";
import { getCmsPageMetadata } from "@/sanity/lib/metadata";

const PATH = "/special-offers";

export function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata(PATH);
}

export default function SpecialOffersPage() {
  return <CmsPage path={PATH} />;
}
