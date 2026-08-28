import type { Metadata } from "next";
import CmsPage from "@/components/sanity/CmsPage";
import { getCmsPageMetadata } from "@/sanity/lib/metadata";

const PATH = "/before-after";

export function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata(PATH);
}

export default function BeforeAfterPage() {
  return <CmsPage path={PATH} />;
}
