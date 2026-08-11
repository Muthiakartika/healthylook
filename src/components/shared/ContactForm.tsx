"use client";

import { useState } from "react";
import { WhatsAppIcon, ArrowRightIcon } from "@/components/ui/icons";
import {
  whatsappHref,
  BOOKING_TIME_SLOTS,
  BOOKING_TREATMENT_OPTIONS,
} from "@/lib/constants";

/**
 * The enquiry form.
 *
 * ⚠ HOW THIS ACTUALLY SUBMITS — the important part.
 *
 * There is no email backend in this build, and the brief forbids inventing
 * a new booking system. The flow the clinic genuinely runs on is WhatsApp
 * — it's the number in their own site header — so submitting composes the
 * enquiry as a WhatsApp message and hands off to it.
 *
 * Deliberately chosen over the two alternatives:
 *   - Posting to nothing and showing a fake "thank you" silently drops
 *     real patient enquiries. That's the worst outcome here, and it's what
 *     an unwired form on a template site usually does.
 *   - `mailto:` opens whatever mail client the device has configured,
 *     which on mobile is frequently none.
 *
 * When a real backend exists, `handleSubmit` is the single function to
 * replace; the fields already match the live site's own form.
 *
 * `withSchedule` adds the preferred date/time fields that the live site's
 * dedicated /book-now page has and its inline footer form doesn't.
 */
export default function ContactForm({
  withSchedule = false,
}: {
  withSchedule?: boolean;
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const lines = [
      "Hello Healthy Look Aesthetic, I'd like to make an enquiry.",
      "",
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      get("phone") ? `Phone: ${get("phone")}` : null,
      get("treatment") ? `Treatment of interest: ${get("treatment")}` : null,
      get("date") ? `Preferred date: ${get("date")}` : null,
      get("time") ? `Preferred time: ${get("time")}` : null,
      get("message") ? "" : null,
      get("message") ? `Message: ${get("message")}` : null,
    ].filter((line): line is string => line !== null);

    // `window.open` rather than assigning location: it keeps the site open
    // in the original tab, so a user coming back from WhatsApp hasn't lost
    // their place.
    window.open(whatsappHref(lines.join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  // `text-body` (16px), not `text-copy` (15px). Below 16px, iOS Safari zooms
  // the page in when a field takes focus and does not zoom back out — so on
  // an iPhone every input in this form left the visitor scrolled sideways on
  // a magnified page, mid-enquiry. One pixel of type size is the entire fix.
  const fieldClass =
    "w-full border-b border-hairline bg-transparent py-3.5 font-sans text-body text-ink " +
    "placeholder:text-muted focus:border-primary focus:outline-none focus-visible:outline-none " +
    "transition-colors duration-300";
  const labelClass = "eyebrow block text-muted";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className={`mt-3 ${fieldClass}`}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
            className={`mt-3 ${fieldClass}`}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            Your phone number (WhatsApp)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+62 …"
            className={`mt-3 ${fieldClass}`}
          />
        </div>

        <div>
          <label htmlFor="treatment" className={labelClass}>
            Please choose your treatment
          </label>
          {/* The clinic's own booking-form list, not the treatment
              catalogue — see BOOKING_TREATMENT_OPTIONS for why the two
              differ and why this one wins. */}
          <select
            id="treatment"
            name="treatment"
            defaultValue=""
            className={`mt-3 ${fieldClass}`}
          >
            <option value="">Not sure yet</option>
            {BOOKING_TREATMENT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {withSchedule && (
          <>
            <div>
              <label htmlFor="date" className={labelClass}>
                Preferred date
              </label>
              <input
                id="date"
                name="date"
                type="date"
                className={`mt-3 ${fieldClass}`}
              />
            </div>

            <div>
              <label htmlFor="time" className={labelClass}>
                Preferred time
              </label>
              {/* The clinic's fifteen published slots, not a bounded time
                  input. A `type="time"` field still accepts 17:47 and still
                  offers 18:00, neither of which the clinic books. */}
              <select
                id="time"
                name="time"
                defaultValue=""
                className={`mt-3 ${fieldClass}`}
              >
                <option value="">Select a time</option>
                {BOOKING_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Additional message
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Tell us what you'd like to know."
          className={`mt-3 resize-none ${fieldClass}`}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-2.5 rounded-brand bg-primary-strong px-8 py-4 font-sans text-caption font-medium uppercase tracking-caps-wide text-white transition-colors duration-300 hover:bg-primary-hover"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Send via WhatsApp
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        {/* Told up front, not after the fact — a button that unexpectedly
            opens another app is a small betrayal of trust, and this is a
            page about trust. */}
        <p className="font-sans text-caption leading-relaxed text-muted">
          Opens WhatsApp with your details filled in.
        </p>
      </div>

      {/* aria-live so the confirmation is announced to screen readers,
          which otherwise get no signal that anything happened. */}
      <p role="status" aria-live="polite" className="min-h-[1.25rem]">
        {sent && (
          <span className="font-sans text-sm text-success">
            Your message is ready in WhatsApp. Press send there and we&rsquo;ll reply
            during opening hours.
          </span>
        )}
      </p>
    </form>
  );
}
