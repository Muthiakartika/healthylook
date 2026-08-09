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

export const metadata: Metadata = {
  title: "Our Blog",
  description:
    "Guides and explainers from the doctors at Healthy Look Aesthetic, Ubud — treatments, results, and what to expect.",
  alternates: { canonical: "/our-blog" },
};

/**
 * /our-blog — previously a 404 that the footer and nav both linked to.
 *
 * Every post on the live blog is listed. Seven resolve to treatment pages
 * inside this build; three still point at the clinic's current site and
 * are labelled as such — see src/data/blog.ts for why those weren't
 * reproduced (short version: their bodies couldn't be extracted in full,
 * and half an article about Botox dosage is not something to publish).
 */
export default function BlogPage() {
  // Reuse each article's treatment photo where the article is about a
  // treatment we have a picture for — no invented imagery, and posts with
  // no photo get the typographic tile.
  const withImages = blogPosts.map((post) => {
    const treatment = post.relatedTreatment
      ? treatments.find((t) => t.name === post.relatedTreatment)
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
        description="What each treatment actually does, who it suits, and what to expect — written by the doctors who perform them."
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
                    <h2 className="flex items-start justify-between gap-3 font-sans text-[length:var(--fs-h4)] leading-snug text-ink transition-colors duration-300 group-hover:text-primary">
                      {post.title}
                      <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </h2>

                    <p className="mt-5 font-sans text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                      {post.external ? "Read on our current site" : "Read the guide"}
                    </p>
                  </div>
                </>
              );

              const className =
                "group flex h-full flex-col border border-hairline bg-background transition-colors duration-300 hover:border-primary/40";

              return (
                <Reveal key={post.title} delay={Math.min(index, 5) * 60}>
                  {post.external ? (
                    <a
                      href={post.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link href={post.href} className={className}>
                      {inner}
                    </Link>
                  )}
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
