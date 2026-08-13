import { NextResponse } from "next/server";
import { EMAIL } from "@/lib/constants";

/**
 * POST /api/enquiry — the booking/enquiry form's backend.
 *
 * ── CLIENT REVISION 13 ────────────────────────────────────────────────
 * "Booking form better enter to email or WA?" — answered: a real email
 * backend, so every enquiry lands in the clinic's inbox as a written
 * record rather than only as a WhatsApp draft on the sender's phone.
 *
 * Why that matters practically: the old form composed a `wa.me` link and
 * opened it. That works, but the enquiry only exists if the visitor then
 * presses send in WhatsApp — and the clinic has no record of the ones who
 * didn't. It also cannot be searched, assigned, or replied to from a
 * desktop.
 *
 * ── WHY THERE IS NO SDK DEPENDENCY ────────────────────────────────────
 * This talks to Resend over its plain HTTP API with `fetch`, rather than
 * `npm i resend`. The SDK is a thin wrapper over exactly this one request,
 * and not adding it keeps the dependency list at three packages. Swapping
 * providers means changing `sendEmail` below and nothing else.
 *
 * ── CONFIGURATION ─────────────────────────────────────────────────────
 * See .env.example. Three variables:
 *
 *   RESEND_API_KEY      required — from resend.com/api-keys
 *   ENQUIRY_FROM_EMAIL  required — an address on a domain verified in
 *                       Resend. It CANNOT be the clinic's Gmail/Zoho
 *                       address unless that domain is verified there;
 *                       sending "from" an unverified domain is what makes
 *                       mail land in spam. e.g. no-reply@healthylook-aesthetic.com
 *   ENQUIRY_TO_EMAIL    optional — defaults to the published clinic address
 *
 * ⚠ Until RESEND_API_KEY is set this route returns 503 `not_configured`,
 * and the form falls back to WhatsApp rather than silently swallowing the
 * enquiry. That is deliberate: a form that shows "thank you" while posting
 * to nothing is the worst possible outcome here, and it is the usual one.
 */

type EnquiryPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  treatment?: unknown;
  date?: unknown;
  time?: unknown;
  message?: unknown;
  /** What the enquiry is about, set by the page. Becomes the subject line. */
  subject?: unknown;
  /**
   * Page-specific answers as label/value pairs — the gift card page's
   * amount and design, for example.
   *
   * Label/value rather than named keys on purpose: this route should not
   * need editing every time a page adds a question. It renders whatever
   * it is given, escaped and bounded (see MAX_EXTRA_FIELDS) — the labels
   * are attacker-controllable in principle, so they are treated exactly
   * like any other untrusted string rather than trusted because they came
   * from our own form.
   */
  extra?: unknown;
  /** Honeypot — see below. Must be empty. */
  website?: unknown;
};

/** Bounds on the page-supplied fields, so one request can't build a novel. */
const MAX_EXTRA_FIELDS = 8;
const MAX_EXTRA_LABEL = 60;
const MAX_EXTRA_VALUE = 200;

/** Trims and caps a field, so one paste cannot post a megabyte of text. */
function clean(value: unknown, maxLength = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/**
 * Deliberately permissive. Server-side email validation exists to catch
 * typos and obvious junk, not to adjudicate RFC 5322 — a stricter regex
 * rejects real addresses (new TLDs, plus-addressing, unicode domains) and
 * every one of those is a lost patient enquiry.
 */
function isPlausibleEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

/** HTML-escape, because these values are interpolated into an HTML email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strips CR/LF from anything that goes into a header-ish field (the
 * subject, the reply-to display name). Newlines in a header are how header
 * injection works — without this, a name of "Bob\nBcc: someone@evil.com"
 * is a request to send mail somewhere the clinic did not intend.
 */
function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * In-memory rate limit: 5 submissions per IP per 10 minutes.
 *
 * ⚠ Per-instance and cleared on restart — on a serverless deploy each cold
 * instance starts fresh, so this is a speed bump against a naive script,
 * not real abuse protection. It is here because it costs nothing; if this
 * form ever gets seriously targeted the answer is a WAF rule or Turnstile
 * at the edge, not a bigger Map.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX) {
    submissions.set(ip, recent);
    return true;
  }

  recent.push(now);
  submissions.set(ip, recent);

  // Opportunistic cleanup, so a long-lived instance doesn't accumulate an
  // entry per IP forever. Cheap because it only runs once the map is big.
  if (submissions.size > 500) {
    for (const [key, times] of submissions) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        submissions.delete(key);
      }
    }
  }

  return false;
}

async function sendEmail(payload: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: payload.from,
      to: [payload.to],
      reply_to: payload.replyTo,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    }),
  });

  if (response.ok) return { ok: true };

  // Read the provider's own error rather than a generic failure: the two
  // things that actually go wrong here are an unverified `from` domain and
  // an expired key, and Resend names both explicitly.
  const detail = await response.text().catch(() => "");
  return { ok: false, detail: `${response.status} ${detail}`.trim() };
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.ENQUIRY_FROM_EMAIL) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Email delivery is not configured. Set RESEND_API_KEY and ENQUIRY_FROM_EMAIL.",
      },
      { status: 503 },
    );
  }

  let body: EnquiryPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Honeypot. The form renders a `website` field that is hidden from
  // people and from screen readers; a human never fills it in, and a bot
  // that fills every input it finds does. Answered with 200 rather than
  // 400 on purpose — a bot told it failed retries, a bot told it succeeded
  // moves on.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const name = singleLine(clean(body.name, 120));
  const email = singleLine(clean(body.email, 254));
  const phone = singleLine(clean(body.phone, 40));
  const treatment = singleLine(clean(body.treatment, 120));
  const date = singleLine(clean(body.date, 40));
  const time = singleLine(clean(body.time, 40));
  const message = clean(body.message, 4000);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!email) fieldErrors.email = "Please give us an email address.";
  else if (!isPlausibleEmail(email)) {
    fieldErrors.email = "That email address doesn't look right.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "validation_failed", fieldErrors },
      { status: 400 },
    );
  }

  const enquirySubject = singleLine(clean(body.subject, 80));

  // Page-supplied rows. Validated shape-first — an `extra` that is not an
  // array of {label,value} strings is dropped entirely rather than
  // half-rendered, because a malformed one is either a bug on our side or
  // someone probing, and neither should reach the clinic's inbox.
  const extraRows: [string, string][] = Array.isArray(body.extra)
    ? body.extra
        .slice(0, MAX_EXTRA_FIELDS)
        .map((item): [string, string] => {
          const record =
            item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return [
            singleLine(clean(record.label, MAX_EXTRA_LABEL)),
            singleLine(clean(record.value, MAX_EXTRA_VALUE)),
          ];
        })
        .filter(([label, value]) => label !== "" && value !== "")
    : [];

  const rows: [string, string][] = (
    [
      ["Name", name],
      ["Email", email],
      ["Phone / WhatsApp", phone],
      ["Treatment of interest", treatment],
      ...extraRows,
      ["Preferred date", date],
      ["Preferred time", time],
    ] as [string, string][]
  ).filter(([, value]) => value !== "");

  const text = [
    enquirySubject
      ? `New enquiry from the website — ${enquirySubject}.`
      : "New enquiry from the website.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    ...(message ? ["", "Message:", message] : []),
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#404040;line-height:1.6">
      <p style="margin:0 0 20px;font-size:14px;color:#726d64">
        ${escapeHtml(
          enquirySubject
            ? `New enquiry from the website — ${enquirySubject}.`
            : "New enquiry from the website.",
        )}
      </p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:560px">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 16px 8px 0;vertical-align:top;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#726d64;white-space:nowrap">${escapeHtml(label)}</td>
            <td style="padding:8px 0;vertical-align:top;font-size:15px;color:#2b2c27">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
      ${
        message
          ? `<div style="margin-top:24px;padding-top:20px;border-top:1px solid #ece6d8">
               <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#726d64">Message</p>
               <p style="margin:0;font-size:15px;color:#2b2c27;white-space:pre-wrap">${escapeHtml(message)}</p>
             </div>`
          : ""
      }
      <p style="margin:28px 0 0;font-size:12px;color:#726d64">
        Reply to this email to answer ${escapeHtml(name)} directly.
      </p>
    </div>
  `.trim();

  const result = await sendEmail({
    from: process.env.ENQUIRY_FROM_EMAIL,
    to: process.env.ENQUIRY_TO_EMAIL || EMAIL,
    // The clinic replies to the patient, not to the no-reply sender.
    replyTo: email,
    // The page's own subject wins over the treatment, so a gift card
    // enquiry is filterable in the clinic's inbox without opening it.
    subject: `Website enquiry — ${name}${
      enquirySubject ? ` (${enquirySubject})` : treatment ? ` (${treatment})` : ""
    }`,
    text,
    html,
  });

  if (!result.ok) {
    // Logged server-side, never returned: the provider's message can name
    // the sending domain and the account, which is not the enquirer's
    // business. They get a generic failure and the WhatsApp fallback.
    console.error("[enquiry] send failed:", result.detail);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
