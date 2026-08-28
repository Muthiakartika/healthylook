import type { Metadata } from "next";
import CmsPage from "@/components/sanity/CmsPage";
import { getCmsPageMetadata } from "@/sanity/lib/metadata";

const PATH = "/pricing";

export function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata(PATH);
}

export default function PricingPage() {
  return <CmsPage path={PATH} />;
}
