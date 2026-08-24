import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import ArticleBody from "@/components/shared/ArticleBody";
import BookingSection from "@/components/home/BookingSection";
import BlogTeaser from "@/components/home/BlogTeaser";
import { getArticles, getArticleBySlug } from "@/lib/site-content";
import { blogPosts } from "@/data/blog";

/**
 * The clinic's long-form articles, at the same top-level URLs the live site
 * uses (/how-long-does-botox-last, /skin-clinic-bali, …). Keeping the real
 * paths is the point: these are the pages that rank, and moving them under a
 * tidier /blog/ prefix would drop every one of them.
 *
 * A root-level `[slug]` catches anything unmatched, but Next resolves static
 * segments first, so /pricing, /our-blog and the rest are unaffected. Any slug
 * that isn't a real article falls through to notFound().
 */
export async function generateStaticParams() {
  // Through the database layer, so an article written in the dashboard
  // gets a prerendered page at the next build; between builds an unlisted
  // slug still renders on demand and is cached from then on.
  return (await getArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  // The blog index is the canonical name for this post, and it's often
  // friendlier than the page's own <h1> ("Collagen Stimulator in Ubud" vs
  // "Liquid Lifting in Bali"), so the breadcrumb uses it where it exists.
  const listing = blogPosts.find((post) => post.articleSlug === slug);

  return (
    <>
      <PageHero
        eyebrow="Our Blog"
        title={article.title}
        description={article.description}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Our Blog", href: "/our-blog" },
          { label: listing?.title ?? article.title },
        ]}
        image="/images/clinic/clinic-04.jpg"
        imageAlt="Healthy Look Aesthetic clinic, Ubud"
      />

      <section className="bg-paper py-section">
        <Container>
          <div className="max-w-3xl">
            <ArticleBody blocks={article.blocks} />
          </div>
        </Container>
      </section>

      <BlogTeaser />
      <BookingSection />
    </>
  );
}
