import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import TreatmentThumb from "@/components/shared/TreatmentThumb";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { TREATMENT_CATEGORIES } from "@/data/treatments";
import { getTreatments, getBlogPosts } from "@/lib/site-content";

/**
 * OUR BLOG — restored.
 *
 * The live home page runs a blog strip directly above the footer, and the
 * rebuild had no equivalent: the only route to /our-blog was a nav item and
 * a footer link. For a clinic whose blog is 46 posts deep and doubles as its
 * treatment-education library, dropping the one on-page entry point to it is
 * a real loss, not a simplification.
 *
 * Three posts, not ten. The live strip shows two; ten would turn the end of
 * the home page into a second index and compete with the booking section
 * that follows it. Three fills the row at every breakpoint and still reads
 * as a teaser.
 */
const FEATURED_COUNT = 3;

export default async function BlogTeaser() {
  const [treatments, blogPosts] = await Promise.all([getTreatments(), getBlogPosts()]);
  const featured = blogPosts.slice(0, FEATURED_COUNT).map((post) => {
    const treatment = post.treatmentSlug
      ? treatments.find((candidate) => candidate.slug === post.treatmentSlug)
      : undefined;
    const category = treatment
      ? TREATMENT_CATEGORIES.find((candidate) => candidate.id === treatment.category)
      : undefined;
    return {
      post,
      image: treatment?.image,
      imagePosition: treatment?.imagePosition,
      categoryLabel: category?.label,
    };
  });

  return (
    <section className="bg-background py-section">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Our Blog"
            title="Read before you book"
            description="What each treatment actually does, who it suits, and what to expect. Written by the doctors who perform them."
            className="lg:max-w-2xl"
          />
          <Reveal delay={120} className="shrink-0">
            <Button href="/our-blog" variant="quiet" withArrow>
              All {blogPosts.length} articles
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(({ post, image, imagePosition, categoryLabel }, index) => {
            const cardClass =
              "group flex h-full flex-col border border-hairline bg-background transition-colors duration-300 hover:border-primary/40";

            const inner = (
              <>
                <TreatmentThumb
                  src={image}
                  name={post.title}
                  categoryLabel={categoryLabel ?? "Healthy Look"}
                  aspect="landscape"
                  position={imagePosition}
                />
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="flex items-start justify-between gap-3 font-sans text-h4 leading-snug text-ink transition-colors duration-300 group-hover:text-primary">
                    {post.title}
                    <ArrowUpRightIcon className="mt-1 h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-5 font-sans text-micro uppercase tracking-caps text-muted">
                    {post.treatmentSlug ? "Read the treatment guide" : "Read the article"}
                  </p>
                </div>
              </>
            );

            return (
              <Reveal key={post.href} delay={index * 90}>
                <Link href={post.href} className={cardClass}>
                  {inner}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
