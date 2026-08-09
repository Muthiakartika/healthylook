import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Container from "@/components/ui/Container";
import { partners } from "@/data/partners";

/**
 * PARTNER BRANDS
 *
 * The manufacturers whose products and devices the clinic actually uses —
 * now rendered as their real logos, pulled from the clinic's own media
 * library, instead of the wordmark text the earlier build used as a
 * stand-in. On a medical-aesthetic site this is one of the few pieces of
 * genuine evidence available without asserting outcomes.
 *
 * The marquee is CSS-only (`@keyframes marquee` in globals.css). The list
 * is duplicated in the markup and the track translates -50%, which is what
 * makes the loop seamless; the duplicate is `aria-hidden` so screen
 * readers hear each brand once. It pauses on hover, and
 * `prefers-reduced-motion` stops it entirely — a permanently moving
 * element is one of the clearest accessibility failures available, and
 * this one is decorative enough that stopping it costs nothing.
 *
 * Logos are greyscale at rest and colour on hover: seventeen full-colour
 * logos in a row is visual noise that competes with the brand's own
 * palette, which is exactly what the brief's "not overly colourful" rule
 * is about.
 */
export default function Partners() {
  return (
    <section className="border-y border-hairline bg-background py-14 lg:py-16">
      <Container>
        {/* "Only the Best Worldwide Products" is the clinic's own heading
            for this strip, on every page of the live site. The rebuild had
            replaced it with "Products & devices we use" — accurate, but
            it's their line to write, not mine, and a content audit flagged
            it as missing on all 28 pages. */}
        <h2 className="sr-only">Only the Best Worldwide Products</h2>
        <Reveal className="flex justify-center">
          <span aria-hidden="true" className="eyebrow text-muted">
            Only the Best Worldwide Products
          </span>
        </Reveal>
      </Container>

      <Reveal delay={100}>
        <div
          className="group relative mt-10 flex overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
          }}
        >
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1 ? "true" : undefined}
              className="flex shrink-0 animate-marquee items-center gap-12 pr-12 group-hover:[animation-play-state:paused] lg:gap-16 lg:pr-16"
            >
              {partners.map((partner) => (
                <li key={`${copy}-${partner.name}`} className="shrink-0">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={250}
                    height={250}
                    sizes="120px"
                    className="h-16 w-auto object-contain opacity-55 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 lg:h-20"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
