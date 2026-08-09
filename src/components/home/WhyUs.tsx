import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Img from "@/components/ui/Img";
import {
  CLINIC_SAFETY_STATEMENT,
  CLINIC_SAFETY_PROTOCOLS,
  CLINIC_LICENCE_NUMBER,
} from "@/data/clinic";

/**
 * SECTION 06 — WHY HEALTHY LOOK
 *
 * ── What changed, and why it's better ──
 * This section used to render five "commitments" that had been written for
 * the rebuild — comfort-first, natural-looking results, and so on. They
 * read fine and meant nothing: any clinic could claim them.
 *
 * It now renders the clinic's own published safety protocols, verbatim
 * from their site: injectables performed only by licensed doctors, a
 * one-patient-one-syringe policy, and emergency preparedness for every
 * injectable. Those are specific, falsifiable commitments — the syringe
 * policy in particular is a real differentiator, because sharing filler
 * syringes between patients is a genuine practice in cheaper clinics and
 * a genuine infection risk.
 *
 * The licence number sits alongside them for the same reason: it's the
 * one credential on this page a sceptical reader can actually go and
 * verify.
 */
export default function WhyUs() {
  return (
    <section className="bg-ink py-section text-white">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow flex items-center gap-3 text-gold-soft">
                <span className="h-px w-8 bg-gold-soft/50" aria-hidden="true" />
                Why Healthy Look
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="mt-8 font-script text-[length:var(--fs-h2)] leading-[var(--lh-heading)] text-white">
                Your safety is our highest priority
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-7 measure font-sans text-[0.9375rem] leading-[var(--lh-body)] text-white/55">
                {CLINIC_SAFETY_STATEMENT}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-8 inline-block border border-white/15 px-4 py-2.5 font-sans text-[0.75rem] tracking-wide text-gold-soft">
                {CLINIC_LICENCE_NUMBER}
              </p>
            </Reveal>

            <Reveal delay={280} variant="image" className="mt-12 hidden lg:block">
              <Img
                src="/images/clinic/devices.jpg"
                alt="Premium aesthetic devices used at Healthy Look Aesthetic"
                aspect="landscape"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ul className="border-t border-white/12">
              {CLINIC_SAFETY_PROTOCOLS.map((point, index) => (
                <li key={point.title} className="border-b border-white/12">
                  <Reveal delay={index * 80}>
                    <div className="flex flex-col gap-4 py-10 sm:flex-row sm:gap-12">
                      <span
                        className="shrink-0 font-script text-numeral leading-none text-gold-soft/70 sm:w-24"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="flex-1">
                        <h3 className="font-sans text-[length:var(--fs-h4)] leading-tight text-white">
                          {point.title}
                        </h3>
                        <p className="mt-3 measure font-sans text-[0.9375rem] leading-[var(--lh-body)] text-white/55">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
