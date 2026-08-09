import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { treatments, treatmentHref } from "@/data/treatments";
import { BOOKING_HREF, whatsappHref } from "@/lib/constants";
import { ArrowUpRightIcon, WhatsAppIcon } from "@/components/ui/icons";

/**
 * 404.
 *
 * This page matters more on this site than on most, because several routes
 * the header and footer link to genuinely don't exist yet — /special-offers,
 * /gift-card, /blog, /privacy-policy, /terms-conditions. Those links are
 * kept (the brief says not to remove existing navigation), so until the
 * clinic supplies that content this page is what a visitor who follows one
 * of them will see.
 *
 * So it's built as a useful dead end rather than an apology: it says
 * plainly that the page is being worked on, offers the treatments a lost
 * visitor most likely wanted, and puts a real human channel one tap away.
 *
 * Note it renders its own top padding — the header is fixed and this page
 * has no full-bleed hero to run underneath it.
 */
export default function NotFound() {
  const highlights = treatments.slice(0, 6);

  return (
    <section className="bg-paper pb-section pt-40 lg:pt-52">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <span className="eyebrow flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
              404
            </span>

            <h1 className="mt-8 font-script text-display-sm leading-[var(--lh-display)] text-primary">
              This page isn&rsquo;t here yet
            </h1>

            <p className="mt-8 measure font-sans text-lead text-text">
              Either the address is wrong, or it&rsquo;s one of the pages we&rsquo;re
              still building. Nothing is broken on your end.
            </p>

            <p className="mt-5 measure font-sans text-[0.9375rem] leading-[var(--lh-body)] text-text-secondary">
              If you were looking for something specific — a treatment, a price, an
              offer — message us and we&rsquo;ll answer directly rather than send you
              hunting.
            </p>

            <div className="mt-11 flex flex-wrap gap-4">
              <Button href="/" variant="primary" withArrow>
                Back to home
              </Button>
              <Button
                href={whatsappHref(
                  "Hello Healthy Look Aesthetic, I was looking for something on your website.",
                )}
                variant="outline"
                external
              >
                <WhatsAppIcon className="h-4 w-4" />
                Ask us
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <h2 className="eyebrow text-muted">Popular treatments</h2>
            <ul className="mt-7 border-t border-hairline">
              {highlights.map((treatment) => (
                <li key={treatment.slug} className="border-b border-hairline">
                  <Link
                    href={treatmentHref(treatment)}
                    className="group flex items-center justify-between gap-6 py-5 font-sans text-[1.0625rem] text-ink transition-colors hover:text-primary"
                  >
                    {treatment.name}
                    <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href="/ubud-bali"
                className="font-sans text-[0.8125rem] uppercase tracking-[0.14em] text-primary hover:text-primary-hover"
              >
                All treatments
              </Link>
              <Link
                href="/pricing"
                className="font-sans text-[0.8125rem] uppercase tracking-[0.14em] text-primary hover:text-primary-hover"
              >
                Pricing
              </Link>
              <Link
                href="/our-doctor"
                className="font-sans text-[0.8125rem] uppercase tracking-[0.14em] text-primary hover:text-primary-hover"
              >
                About
              </Link>
              <Link
                href={BOOKING_HREF}
                className="font-sans text-[0.8125rem] uppercase tracking-[0.14em] text-primary hover:text-primary-hover"
              >
                Book
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
