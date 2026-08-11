import Img from "@/components/ui/Img";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { whatsappHref } from "@/lib/constants";
import type { Doctor } from "@/data/doctors";

/**
 * SECTION 07 — DOCTOR / TEAM (shared between the homepage and /our-doctor)
 *
 * A large editorial profile rather than a directory card: portrait on one
 * half, credentials on the other, alternating sides so the page doesn't
 * develop a hard left edge.
 *
 * The bio is now an array of paragraphs rather than one block, because
 * that's how the clinic writes it — four separate statements for Dr. Irene,
 * three for Dr. Jess. Rendering them as separate paragraphs keeps each
 * credential its own beat instead of running them into a wall of text.
 *
 * Nothing is truncated and there's no "read more": on a medical site,
 * hiding a doctor's qualifications behind an interaction works directly
 * against the credibility the section exists to build.
 */
export default function DoctorProfile({
  doctor,
  index,
  showCta = true,
}: {
  doctor: Doctor;
  index: number;
  showCta?: boolean;
}) {
  // Alternate the image side with `lg:order-*` rather than reordering the
  // DOM, so reading order stays name-then-bio for screen readers.
  const imageFirst = index % 2 === 0;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <Reveal
        variant="image"
        className={imageFirst ? "lg:order-1" : "lg:order-2"}
      >
        <Img
          src={doctor.photo}
          alt={`${doctor.name}, ${doctor.title} at Healthy Look Aesthetic`}
          aspect="portrait"
          // Portraits from a square source: faces sit in the upper half,
          // so a centred crop would cut foreheads. Bias the crop upward.
          position="object-top"
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
      </Reveal>

      <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
        <Reveal delay={80}>
          <span className="eyebrow text-primary-strong">{doctor.title}</span>
        </Reveal>

        <Reveal delay={130}>
          {/* The name stays in Poppins, not the script face. A medical
              credential set in a decorative script reads as marketing;
              set in the clinical voice it reads as a qualification. */}
          <h3 className="mt-5 font-sans text-h3 font-medium leading-tight text-ink">
            {doctor.name}
          </h3>
        </Reveal>

        <div className="mt-7 flex flex-col gap-4">
          {doctor.bio.map((paragraph, paragraphIndex) => (
            <Reveal key={paragraph} delay={180 + paragraphIndex * 50}>
              <p className="measure font-sans text-body leading-body text-text-secondary">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        {showCta && (
          <Reveal delay={380}>
            <div className="mt-9">
              <Button
                href={whatsappHref(
                  `Hello Healthy Look Aesthetic, I'd like to book with ${doctor.shortName}.`,
                )}
                variant="quiet"
                size="sm"
                withArrow
                external
              >
                Book with {doctor.shortName}
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
