import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import TreatmentThumb from "@/components/shared/TreatmentThumb";
import BookingSection from "@/components/home/BookingSection";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { blogPosts } from "@/data/blog";
import { treatments, TREATMENT_CATEGORIES } from "@/data/treatments";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/our-blog")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/our-blog" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /our-blog — the complete index.
 *
 * The live blog is paginated five pages deep and an earlier pass captured
 * only page one, so this listed 10 of the site's 46 posts. All 46 are here
 * now, on one page: 46 cards is a comfortable single scroll, and paginating
 * a list this size only hides content behind a click.
 */
export default function BlogPage() {
  // Reuse each article's treatment photo where the article is about a
  // treatment we have a picture for — no invented imagery, and posts with
  // no photo get the typographic tile.
  const withImages = blogPosts.map((post) => {
    const treatment = post.treatmentSlug
      ? treatments.find((t) => t.slug === post.treatmentSlug)
      : undefined;
    const category = treatment
      ? TREATMENT_CATEGORIES.find((c) => c.id === treatment.category)
      : undefined;
    return { post, image: treatment?.image, categoryLabel: category?.label };
  });

  return (
    <>
      <PageHero
        eyebrow="Our Blog"
        title="Guides from our doctors"
        crumbs={[{ label: "Home", href: "/" }, { label: "Our Blog" }]}
        description="What each treatment actually does, who it suits, and what to expect. Written by the doctors who perform them."
        image="/images/clinic/clinic-04.jpg"
        imageAlt="Healthy Look Aesthetic clinic, Ubud"
      />

      <section className="bg-paper py-section">
        <Container>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {withImages.map(({ post, image, categoryLabel }, index) => {
              const inner = (
                <>
                  <TreatmentThumb
                    src={image}
                    name={post.title}
                    categoryLabel={categoryLabel ?? "Healthy Look"}
                    aspect="landscape"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <h2 className="flex items-start justify-between gap-3 font-sans text-h4 leading-snug text-ink transition-colors duration-300 group-hover:text-primary">
                      {post.title}
                      <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </h2>

                    <p className="mt-5 font-sans text-micro uppercase tracking-caps text-muted">
                      {post.treatmentSlug ? "Read the treatment guide" : "Read the article"}
                    </p>
                  </div>
                </>
              );

              return (
                <Reveal key={post.href} delay={Math.min(index, 5) * 60}>
                  <Link
                    href={post.href}
                    className="group flex h-full flex-col border border-hairline bg-background transition-colors duration-300 hover:border-primary/40"
                  >
                    {inner}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <BookingSection />
    </>
  );
}
