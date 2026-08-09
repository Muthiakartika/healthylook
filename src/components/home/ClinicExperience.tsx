import Image from "next/image";
import Container from "@/components/ui/Container";
import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { MapPinIcon, ClockIcon } from "@/components/ui/icons";
import { OPENING_HOURS, MAPS_HREF, ADDRESS } from "@/lib/constants";

/**
 * SECTION 10 — CLINIC / EXPERIENCE
 *
 * The question this section answers is "what does it feel like to go
 * there", and the honest answer is unusual enough to deserve a full-bleed
 * moment: the clinic sits inside a five-star resort outside central Ubud.
 *
 * ── Why the cinematic band is built from three images ──
 * The brief wants one wide, cinematic moment here, and the earlier version
 * used a single 21:9 frame. That can't work with this client's
 * photography: every source image is square, so a 21:9 crop of a 1080×1080
 * photo throws away two thirds of the frame and lands on whatever happens
 * to be in the middle band.
 *
 * A three-up strip of squares gets the same full-bleed cinematic width
 * while showing each photo at close to its native ratio — the composition
 * adapts to the assets rather than mangling them. On mobile it drops to
 * the single strongest image, since three tiny squares side by side would
 * be unreadable.
 */
const STRIP = [
  { src: "/images/clinic/clinic-01.jpg", alt: "Healthy Look Aesthetic clinic interior" },
  { src: "/images/clinic/clinic-03.jpg", alt: "Treatment room at Healthy Look Aesthetic" },
  { src: "/images/clinic/clinic-05.jpg", alt: "The clinic at Ubud Nyuh Bali Resort" },
];

export default function ClinicExperience() {
  return (
    <section className="bg-background py-section">
      {/* Cinematic band */}
      <Reveal variant="image" className="full-bleed">
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
          {STRIP.map((shot, index) => (
            <div
              key={shot.src}
              // Only the first image shows on phones; the other two would
              // each be ~120px tall in a three-column strip.
              className={`relative aspect-square sm:aspect-[4/5] ${
                index === 0 ? "" : "hidden sm:block"
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Reveal>

      <Container>
        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow flex items-center gap-3 text-primary">
                <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                The Clinic
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h2 className="mt-8 font-script text-[length:var(--fs-h2)] leading-[var(--lh-heading)] text-primary">
                Set inside a five-star resort in Ubud
              </h2>
            </Reveal>

            <Reveal delay={150} variant="image" className="mt-10 hidden lg:block">
              <Img
                src="/images/clinic/products.jpg"
                alt="Premium aesthetic products used at Healthy Look Aesthetic"
                aspect="landscape"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={140}>
              <p className="measure font-sans text-lead text-text">
                Tucked inside a resort just outside central Ubud, the clinic pairs
                clinical precision with a genuinely calm setting — an unhurried hour
                away from the noise of a typical clinic day.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <ul className="mt-10 flex flex-col gap-4 border-t border-hairline pt-8">
                <li className="flex items-start gap-3.5 font-sans text-[0.9375rem] text-text-secondary">
                  <MapPinIcon className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  <a
                    href={MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    {ADDRESS}
                  </a>
                </li>
                <li className="flex items-start gap-3.5 font-sans text-[0.9375rem] text-text-secondary">
                  <ClockIcon className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  {OPENING_HOURS}
                </li>
              </ul>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/ubud-bali" variant="primary" withArrow>
                  Explore our treatments
                </Button>
                <Button href={MAPS_HREF} variant="outline" external>
                  Open in Google Maps
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
