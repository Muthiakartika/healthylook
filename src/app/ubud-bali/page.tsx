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
import { TREATMENT_CATEGORIES, treatments, treatmentHref } from "@/data/treatments";

export const metadata: Metadata = {
  title: "Treatments in Ubud, Bali",
  description:
    "Facial enhancement, skin treatments, body treatments, and hair & booster therapies at Healthy Look Aesthetic, Ubud — Botox, dermal filler, HIFU, Sculptra, Sylfirm X, Profhilo and more.",
  alternates: { canonical: "/ubud-bali" },
};

/**
 * /ubud-bali — the full treatment index
 *
 * This is the live site's own URL for the treatments hub (it doubles as
 * the Ubud clinic page there), so the redesign keeps it rather than
 * inventing /treatments and orphaning every existing inbound link.
 *
 * One editorial block per category, each with its own image and numbered
 * index. All 27 treatments appear exactly once, and each category's
 * heading is an anchor target (`#facial-enhancement` etc.) so the footer
 * and the nav can link straight to a section.
 */
export default function TreatmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Everything we offer, and what each one is for"
        crumbs={[{ label: "Home", href: "/" }, { label: "Treatments" }]}
        description="Non-invasive facial enhancement, skin rejuvenation, body contouring, and hair restoration — each planned and performed by a licensed doctor."
        image="/images/clinic/clinic-09.jpg"
        imageAlt="Treatment room at Healthy Look Aesthetic, Ubud"
      />

      {/* Category quick-jump. With 27 treatments across four categories,
          landing at the top of a long page with no way to skip is the
          usual failure of an index page this size. */}
      <section className="border-b border-hairline bg-paper">
        <Container className="flex flex-wrap gap-x-8 gap-y-3 py-6">
          {TREATMENT_CATEGORIES.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="font-sans text-[0.75rem] uppercase tracking-[0.14em] text-text-secondary transition-colors hover:text-primary"
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
                      <span className="eyebrow flex items-center gap-3 text-primary">
                        <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </span>
                    </Reveal>
                    <Reveal delay={80}>
                      <h2 className="mt-7 font-script text-[length:var(--fs-h2)] leading-[var(--lh-heading)] text-primary">
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
                            <span className="pt-1.5 font-sans text-[0.75rem] tabular-nums tracking-widest text-muted">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1">
                              <h3 className="flex flex-wrap items-center gap-x-3 font-sans text-[length:var(--fs-h3)] leading-tight text-ink transition-colors duration-300 group-hover:text-primary">
                                {treatment.name}
                                <ArrowUpRightIcon className="h-4 w-4 shrink-0 -translate-x-2 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                              </h3>
                              <p className="mt-3 measure font-sans text-[0.9375rem] leading-relaxed text-text-secondary">
                                {treatment.shortDescription}
                              </p>
                              {treatment.startingPrice != null && (
                                <p className="mt-4 font-sans text-[0.75rem] uppercase tracking-[0.12em] text-muted">
                                  From {formatIDR(treatment.startingPrice)}
                                  {treatment.priceUnit ? ` ${treatment.priceUnit}` : ""}
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
