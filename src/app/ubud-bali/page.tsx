import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageHero from "@/components/shared/PageHero";
import Reveal from "@/components/ui/Reveal";
import Img from "@/components/ui/Img";
import Partners from "@/components/home/Partners";
import BookingSection from "@/components/home/BookingSection";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { formatIDR } from "@/lib/format";
import { TREATMENT_CATEGORIES, treatmentHref } from "@/data/treatments";
import { getTreatments } from "@/lib/site-content";
import { getPageSeo } from "@/data/seo";

const seo = getPageSeo("/ubud-bali")!;

export const metadata: Metadata = {
  // Text lives in src/data/seo.ts — edit it there, not here.
  title: { absolute: seo.title },
  description: seo.description,
  alternates: { canonical: "/ubud-bali" },
  openGraph: { title: seo.title, description: seo.description },
};

/**
 * /ubud-bali — the full treatment index
 *
 * This is the live site's own URL for the treatments hub (it doubles as
 * the Ubud clinic page there), so the redesign keeps it rather than
 * inventing /treatments and orphaning every existing inbound link.
 *
 * One editorial block per category, each with its own image and numbered
 * index. Every treatment in the catalogue appears exactly once, and each category's
 * heading is an anchor target (`#facial-enhancement` etc.) so the footer
 * and the nav can link straight to a section.
 */
export default async function TreatmentsPage() {
  const treatments = await getTreatments();
  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Everything we offer, and what each one is for"
        crumbs={[{ label: "Home", href: "/" }, { label: "Treatments" }]}
        description="Non-invasive facial enhancement, skin rejuvenation, body contouring, and hair restoration, each planned and performed by a licensed doctor."
        image="/images/clinic/clinic-09.jpg"
        imageAlt="Treatment room at Healthy Look Aesthetic, Ubud"
      />

      {/* Category quick-jump. With 30+ treatments across four categories,
          landing at the top of a long page with no way to skip is the
          usual failure of an index page this size. */}
      <section className="border-b border-hairline bg-paper">
        {/* The vertical gap moved into the links' padding: they were 17px-tall
            tap targets with 12px of dead space between the wrapped rows on a
            phone, which is the smallest thing anyone is asked to hit on this
            page. Same rhythm, 29px targets. */}
        <Container className="flex flex-wrap gap-x-8 py-4">
          {TREATMENT_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="py-1.5 font-sans text-caption uppercase tracking-caps text-text-secondary transition-colors hover:text-primary-strong"
            >
              {category.label}
              <span className="ml-2 text-muted/70">
                {treatments.filter((t) => t.category === category.id).length}
              </span>
            </a>
          ))}
        </Container>
      </section>

      {TREATMENT_CATEGORIES.map((category, categoryIndex) => {
        const list = treatments.filter((t) => t.category === category.id);
        if (list.length === 0) return null;

        const alt = categoryIndex % 2 === 1;
        // Not every category has a photo on the live site; fall back to
        // the first treatment in it that does.
        const image = category.image ?? list.find((t) => t.image)?.image ?? null;

        return (
          <section
            key={category.id}
            id={category.id}
            className={`scroll-mt-28 py-section ${alt ? "bg-wash" : "bg-background"}`}
          >
            <Container>
              <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
                <div className={`lg:col-span-4 ${alt ? "lg:order-2" : ""}`}>
                  <div className="lg:sticky lg:top-32">
                    <Reveal>
                      <span className="eyebrow flex items-center gap-3 text-primary-strong">
                        <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </span>
                    </Reveal>
                    <Reveal delay={80}>
                      <h2 className="mt-7 font-script text-h2 leading-heading text-primary">
                        {category.label}
                      </h2>
                    </Reveal>
                    {image && (
                      <Reveal delay={140} variant="image" className="mt-10">
                        <Img
                          src={image}
                          alt={`${category.label} at Healthy Look Aesthetic`}
                          aspect="landscape"
                          sizes="(max-width: 1024px) 100vw, 30vw"
                        />
                      </Reveal>
                    )}
                  </div>
                </div>

                <div className={`lg:col-span-8 ${alt ? "lg:order-1" : ""}`}>
                  <ul className="border-t border-hairline">
                    {list.map((treatment, index) => (
                      <li key={treatment.slug} className="border-b border-hairline">
                        <Reveal delay={Math.min(index, 6) * 50}>
                          <Link
                            href={treatmentHref(treatment)}
                            className="group flex gap-6 py-7 sm:gap-10"
                          >
                            <span className="pt-1.5 font-sans text-caption tabular-nums tracking-widest text-muted">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1">
                              <h3 className="flex flex-wrap items-center gap-x-3 font-sans text-h3 leading-tight text-ink transition-colors duration-300 group-hover:text-primary">
                                {treatment.name}
                                <ArrowUpRightIcon className="h-4 w-4 shrink-0 -translate-x-2 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                              </h3>
                              <p className="mt-3 measure font-sans text-copy leading-relaxed text-text-secondary">
                                {treatment.shortDescription}
                              </p>
                              {/* Price AND treatment time, because that is
                                  the pair the live site puts on every card of
                                  its own treatments index. The rebuild was
                                  showing price alone. */}
                              {(treatment.startingPrice != null ||
                                treatment.treatmentTime) && (
                                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-caption uppercase tracking-label text-muted">
                                  {treatment.startingPrice != null && (
                                    <span>
                                      From {formatIDR(treatment.startingPrice)}
                                      {treatment.priceUnit
                                        ? ` ${treatment.priceUnit}`
                                        : ""}
                                    </span>
                                  )}
                                  {treatment.startingPrice != null &&
                                    treatment.treatmentTime && (
                                      <span
                                        aria-hidden="true"
                                        className="text-primary/40"
                                      >
                                        ·
                                      </span>
                                    )}
                                  {treatment.treatmentTime && (
                                    <span>
                                      {/* Short form here, full sentence in
                                          the At-a-glance box. This line is
                                          uppercase next to the price; the
                                          clinic's "60–75 minutes, depending
                                          on the type of filler, including
                                          anaesthesia" belongs on the
                                          treatment page, not on a card. */}
                                      {treatment.treatmentTimeShort ??
                                        treatment.treatmentTime}
                                    </span>
                                  )}
                                </p>
                              )}
                            </div>
                          </Link>
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Container>
          </section>
        );
      })}

      <Partners />
      <BookingSection />
    </>
  );
}
