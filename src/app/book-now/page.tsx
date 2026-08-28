import type { Metadata } from "next";
import CmsPage from "@/components/sanity/CmsPage";
import { getCmsPageMetadata } from "@/sanity/lib/metadata";

const PATH = "/book-now";

export function generateMetadata(): Promise<Metadata> {
  return getCmsPageMetadata(PATH);
}

export default function BookNowPage() {
  return <CmsPage path={PATH} />;
}
