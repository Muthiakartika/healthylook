# Healthy Look Aesthetic — Website Redesign

A Next.js rebuild of healthylook-aesthetic.com, for the clinic's web contractor.
App Router, TypeScript, Tailwind CSS v4.

## Commands

- `npm run dev` — dev server (port 3006, see `.claude/launch.json`)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

> Don't run `npm run build` while `npm run dev` is running — they share
> `.next/`, and the build overwrites the dev server's assets, leaving the running
> dev site serving 404s for its own CSS until you restart it.

## Content parity with the live site

Treatment pages were audited word-for-word against healthylook-aesthetic.com.
The first audit found them carrying only **74%** of the original text (as low as
40% on some pages). The gaps were:

| Gap | Fix |
| --- | --- |
| 184 real FAQs across 25 treatments; the rebuild had 4 hand-written Botox ones | `src/data/treatmentFaqs.ts`, extracted verbatim |
| "Why Choose X" sections with treatment-specific claims | `src/data/treatmentSections.ts`, extracted verbatim |
| "Only the Best Worldwide Products" strip missing from all 27 treatment pages | `<Partners />` added to the treatment route |
| "Be Empowered to Feel Truly Confident" before/after heading | Added as a band linking to `/before-after` |
| Long-form prose on the three worst pages (Sylfirm X, Juvelook, Lysiwave) | Second extraction pass — see below |

### Why the long-form copy needed a second pass

The first extractor only read Oxygen's `ct-text-block` elements. Three pages keep
their explanatory copy in `oxy-rich-text` blocks instead — real `<p>`/`<ol>`
prose running to several hundred words, including comparison sections
("Microwaves vs Radiofrequency in Bali", "Sylfirm x vs microneedling"). Those
pages sat at 73–79% while everything else cleared 87%.

`TreatmentSection` therefore has two shapes, matching how the site actually
writes: `points` for short claim bullets, `blocks` for prose under optional
sub-headings. Flattening the prose into bullets would have destroyed it.

Now at **113% average** across the 27 treatment pages this script measured —
the rebuild also carries pricing tables and safety content the live pages
don't repeat. **Every page is at 87% or above**; the floor was 40% before this
work. (The catalogue has since grown to 32 treatments — see below; the 5 added
after this measurement haven't been run through the same script.)

**Known remaining differences**, all small, current as of a full re-audit against
the live site on 2026-08-21:

- `collagen-stimulator` was the lowest-scoring page in the original pass. Its
  "Available Collagen Stimulators" section (Sculptra/PLLA, Novuma/CaHA, Juvelook
  Classic/PDLLA, Gouri/PCL) is now fully present, and Novuma's price row is what
  carries the CaHA product — it's priced under its brand name, not the generic
  material name, which reads as a gap until you check both files side by side.
- The two FAQ-shaped questions the accordion parser used to miss ("Is PRP in
  Bali the same in every clinic?", "Who Is Suitable for Autologous Micrograft in
  Bali?") are both present in `treatmentSections.ts`, as section headings rather
  than accordion items — that's also how the live page presents them, ahead of
  its formal FAQ block.
- `microneedling/rf` (Sylfirm X) was missing one section, "Sylfirm X Before and
  After" — the live page pairs one sentence with six photographs. The sentence
  is now in `treatmentSections.ts`; the photographs aren't, because `results.ts`
  has no Sylfirm X category and inventing or borrowing mismatched images is the
  one thing this rebuild has consistently refused to do. The page already links
  to the real gallery lower down, same as every other treatment page.
- The FAQ section heading now reads the live site's plain `FAQ` on every
  treatment page (`TreatmentDetail.tsx`) — it briefly read `"{Treatment},
  answered"`, a wording change with no client note behind it, reverted for the
  same reason nothing else gets reworded without one.

Measured with the scripts in the session scratchpad. If you re-run them, do it
against a **freshly started** dev server — a long editing session corrupts
Next's HMR state (`__webpack_modules__ is not a function`) and pages start
returning 404/500, which silently skews the numbers rather than failing loudly.

## Content and URLs come from the live site

Everything below was taken from healthylook-aesthetic.com, not written for this
rebuild:

- **32 treatments** — real names, real categories, real descriptions, real prices.
  27 of them are on the live site's own `/ubud-bali` hub; 5 more (Collagen
  Stimulator, Lip Filler, Korean Botox, Facial, Slimming & Body Contouring) are
  live pages the hub itself doesn't list — reproduced faithfully, hub omission
  and all, rather than either invented or dropped for being hard to find.
- **The full price list** — every brand, variant, and package from `/pricing`,
  verbatim, including the "By Consultation" row and the nett-price footnote.
- **Doctor bios** — verbatim, including Dr. Jessika Sobaevana's full name.
- **Clinic facts** — the licence statement and number
  (`Sertifikat Standar No. 16112100281550002`), the philosophy, and the three
  published safety protocols.
- **All photography** — 146 files in `public/images/`, copied from the
  client's own WordPress media library (not hotlinked).

**URLs match the live site**, which matters for SEO:

| Route | Notes |
| --- | --- |
| `/` | Home |
| `/ubud-bali` | Treatments index (the live site's own URL) |
| `/ubud-bali/[...slug]` | 31 treatment pages. Catch-all because five real paths are two segments deep (`hifu/body`, `prp/hair`, `microneedling/rf`, `facial/medi`, `botox/korean`) |
| `/eye-rejuvenaton-treatment` | The 32nd treatment — the live site's own URL, root-level and misspelled, kept exactly as published |
| `/our-doctor` | About / doctors (the live site's own URL) |
| `/pricing` | Full price list — 236 rows, verbatim |
| `/before-after` | Results — 56 photographs across 6 categories |
| `/special-offers` | Botox discounts, transfer service, airline staff rates |
| `/gift-card` | Denominations + terms |
| `/our-blog` | All 46 posts from the live blog (5 pages on the live site, one scroll here) |
| `/[slug]` | 14 standalone articles at their own top-level URLs (root catch-all; falls through to `notFound()` for anything that isn't a real article) |
| `/book-now` | Booking form with date/time |
| `/privacy-policy` | Verbatim |
| `/terms-conditions` | Verbatim |

**57 live URLs, 57 matched, zero 404s** — cross-checked against the live
site's own `page-sitemap.xml` + `post-sitemap.xml` (Yoast-generated), which is
the authoritative list of what it publishes. Superseded a manual homepage
crawl that had put the number at 38 and missed everything not linked from the
homepage itself.

`next.config.ts` 308-redirects the interim URLs an earlier pass of this build
used (`/about`, `/treatments`, `/treatments/*`, `/locations/ubud`, `/blog`).

## The redesign

A **redesign, not a rebrand**. Both fonts (Poppins, Tangerine) and every brand
colour are unchanged — the hex values were measured from the live site and sit
untouched in `src/app/globals.css`. What changed is how they're used:

- **Two type voices.** Tangerine is display-scale only (up to 10rem) and carries
  the emotional register; Poppins carries everything a patient must read
  carefully — treatment names, credentials, prices. Nothing clinical is set in a
  script face.
- **Derived tonal steps.** `--color-paper`, `--color-wash`, `--color-ink` are
  lightness shifts of existing brand hues, so large areas can differ in tone
  without a second palette. The saturated lime is an accent only.
- **Motion.** One easing curve, one scroll-reveal primitive, no animation
  library. Reveals never hide content before JS confirms it can un-hide it, and
  `prefers-reduced-motion` skips them.

### A constraint worth knowing: every source photo is square

The WordPress site cropped everything to 1:1, and for `object-cover` a 1:1
source in a box of ratio `r` keeps only `min(r, 1/r)` of the picture. Layouts
are therefore chosen from that maths, not from taste:

- **Inner-page heroes are a split**, not a full-bleed band. Full-bleed at 70svh
  on a 1440px screen is ~2.2:1 and kept **44%** of the photo; the split image
  column is ~0.9:1 and keeps **88%**. Small screens use 1:1 and 9:8 (100% / 89%).
- **The homepage's cinematic band** is a three-up strip of squares rather than
  one 21:9 frame, which would discard two thirds of each shot.
- **Portraits use `object-top`** — faces sit high, so a centred crop cuts foreheads.
- **32 treatments, each with its own photograph.** Any "fall back to the
  category image" scheme repeats the same photo several times per page, so a
  treatment with no photo of its own gets a deliberate typographic tile
  (`components/shared/TreatmentThumb.tsx`) instead — currently unused in
  practice, since every treatment now carries a dedicated `image`. Verified: 0
  duplicate images across all 32 treatment pages.

## What's still open

Everything this section used to list — placeholder testimonials, no email
booking backend, missing treatment photos, a single before/after image, three
unmigrated blog articles — has since been closed in the code below. A full
content/URL/SEO audit against the live site on 2026-08-21 (57/57 live URLs
matched, testimonials/pricing/doctor bios/offers spot-verified word-for-word)
found the actual remaining gaps to be much smaller:

- **Three SEO tags knowingly preserve live-site mistakes.** `/ubud-bali`,
  `/before-after`, and `/gift-card` carry the live site's untouched WordPress
  fallback title ("Page - healthylook-aesthetic.com"); `/our-blog` shares an
  identical title and description with `/our-doctor`. Both are flagged `FIXME`
  in `src/data/seo.ts` with a suggested replacement. Left alone on purpose —
  fixing them is a copy change, not a parity one, and needs the client's
  sign-off rather than an engineering call.
- **One gift-card detail couldn't be confirmed either way.** The live
  `/gift-card` purchase flow renders its design/occasion picker through what
  looks like a client-side widget, which two independent fetch attempts both
  failed to enumerate in full. `GIFT_CARD_DESIGNS` in `src/data/offers.ts`
  carries 6 options; only 5 could be confirmed live. Worth a two-minute look at
  the actual page before trusting either count.
- **Not every row was re-diffed character-for-character.** All 199 treatment
  FAQ answers, every price row beyond the categories sampled in the August
  audit, and the full body of all 46 blog posts are extracted the same
  verbatim way as everything that *was* spot-checked — but "spot-checked and
  consistent everywhere it was tested" and "every character re-diffed" are
  different claims, and this file doesn't blur them.
