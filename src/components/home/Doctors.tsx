import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DoctorProfile from "@/components/shared/DoctorProfile";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { doctors } from "@/data/doctors";

/**
 * SECTION 07 — DOCTOR / TEAM (homepage placement)
 *
 * Placed immediately after the safety section on purpose. The clinic has
 * just stated that all injectables are performed only by licensed doctors,
 * so the doctors themselves should be the very next thing the visitor
 * sees. Claim, then evidence.
 */
export default function Doctors() {
  return (
    <section className="bg-background py-section">
      <Container>
        <SectionHeading
          eyebrow="Our Doctors"
          title="The people who will actually treat you"
          description="Every consultation, treatment plan, and injection is handled by a licensed doctor."
        />

        <div className="mt-20 flex flex-col gap-24 lg:gap-32">
          {doctors.map((doctor, index) => (
            <DoctorProfile key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>

        <Reveal delay={100} className="mt-20 flex justify-center">
          <Button href="/our-doctor" variant="outline" withArrow>
            More about the clinic
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
