import type { ReactNode } from "react";
import PageBuilder from "@/components/sanity/PageBuilder";
import type { SanityPage } from "@/sanity/types";

type ManagedPageProps = {
  page: SanityPage | null;
  children: ReactNode;
};

/** Uses the structured Sanity page when published and the original route as a
 * resilient fallback while a project is unconfigured or content is missing. */
export default function ManagedPage({ page, children }: ManagedPageProps) {
  if (!page) return children;
  return <PageBuilder sections={page.sections} />;
}
