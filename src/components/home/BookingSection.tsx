import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/shared/ContactForm";
import { WhatsAppIcon, PhoneIcon, MailIcon, MapPinIcon, ClockIcon } from "@/components/ui/icons";
import {
  EMAIL,
  PHONE_DISPLAY,
  PHONE_E164,
  ADDRESS,
  OPENING_HOURS,
  MAPS_HREF,
  whatsappHref,
} from "@/lib/constants";

/**
 * SECTION 13 — FINAL CTA + ENQUIRY
 *
 * One strong, intentional conversion section before the footer. Two
 * decisions shape it:
 *
 * 1. Channels first, form second. The form sits on the right, but the
 *    left column leads with WhatsApp, phone, and email as direct links.
 *    Plenty of people — especially on mobile, and especially for a medical
 *    enquiry — would rather message than fill in five fields, and a
 *    conversion section that only offers a form quietly loses them.
 *
 * 2. It gets the pale lime band. This is the one section where the brand's
 *    secondary colour leads, which makes the page's most important call to
 *    action also its most tonally distinct moment.
 *
 * `id="book"` is the target for every "Book Now" on the site, and
 * globals.css sets `scroll-padding-top` so the fixed header doesn't cover
 * the heading on arrival.
 */
export default function BookingSection() {
  return (
    <section id="book" className="scroll-mt-24 bg-section py-section">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="eyebrow flex items-center gap-3 text-primary-strong">
                <span className="h-px w-8 bg-primary/40" aria-hidden="true" />
                Book an appointment
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="mt-8 font-script text-h1 leading-script text-primary">
                Come and see us in Ubud
              </h2>
            </Reveal>

            <Reveal delay={150}>
              <p className="mt-8 measure-narrow font-sans text-lead text-text">
                Tell us what you&rsquo;re thinking about and a doctor will tell you
                honestly whether it&rsquo;s the right treatment for you.
              </p>
            </Reveal>

            <Reveal delay={210}>
              <ul className="mt-12 flex flex-col gap-5 border-t border-primary/20 pt-10">
                <li>
                  <a
                    href={whatsappHref(
                      "Hello Healthy Look Aesthetic, I'd like to book an appointment.",
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                  >
                    <WhatsAppIcon className="h-5 w-5 shrink-0 text-primary" />
                    Message us on WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${PHONE_E164}`}
                    className="flex items-center gap-4 font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                  >
                    <PhoneIcon className="h-5 w-5 shrink-0 text-primary" />
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-4 break-all font-sans text-copy-lg text-ink transition-colors hover:text-primary"
                  >
                    <MailIcon className="h-5 w-5 shrink-0 text-primary" />
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={270}>
              <ul className="mt-10 flex flex-col gap-4 font-sans text-sm text-text-secondary">
                <li className="flex items-start gap-4">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {/* `-my-1 py-1` grows the tap target from 20px to 28px
                      without changing the layout: the padding box gets
                      taller, the negative margin gives the extra height
                      back, so the address stays aligned with the pin icon
                      beside it. */}
                  <a
                    href={MAPS_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-my-1 py-1 transition-colors hover:text-primary"
                  >
                    {ADDRESS}
                  </a>
                </li>
                <li className="flex items-start gap-4">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {OPENING_HOURS}
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={140}>
              <div className="rounded-edge border border-primary/15 bg-background p-8 sm:p-12">
                <h3 className="font-sans text-h4 text-ink">
                  Send us a message
                </h3>
                <p className="mt-2 font-sans text-sm text-text-secondary">
                  We reply during opening hours, every day 10.00 - 18.00.
                </p>

                <div className="mt-10">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
