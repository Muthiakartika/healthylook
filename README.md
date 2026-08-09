# Healthy Look Aesthetic — Website Redesign

A Next.js rebuild of healthylook-aesthetic.com, for the clinic's web contractor.
App Router, TypeScript, Tailwind CSS v4.

## Commands

- `npm run dev` — dev server (port 3010, see `.claude/launch.json`)
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

Now at **113% average** across the 27 treatment pages — the rebuild also carries
pricing tables and safety content the live pages don't repeat. **Every page is
at 87% or above**; the floor was 40% before this work.

**Known remaining differences**, all small:

- `collagen-stimulator` **87%** — the lowest page, but with **zero** missing
  headings. The gap is wording density, not a missing section.
- **5 individual FAQ questions** the accordion parse still misses, e.g. "Is PRP
  in Bali the same in every clinic?", "Who Is Suitable for Autologous Micrograft
  in Bali?".
- **"No Downtime"** — a benefit tile heading on 5 pages.
- The FAQ section heading: the live site says `FAQ`, this build says
  `"{Treatment}, answered"`. A deliberate wording change, not a loss — revert it
  in `app/ubud-bali/[...slug]/page.tsx` if the original is preferred.

Measured with the scripts in the session scratchpad. If you re-run them, do it
against a **freshly started** dev server — a long editing session corrupts
Next's HMR state (`__webpack_modules__ is not a function`) and pages start
returning 404/500, which silently skews the numbers rather than failing loudly.

## Content and URLs come from the live site

Everything below was taken from healthylook-aesthetic.com, not written for this
rebuild:

- **27 treatments** — real names, real categories, real descriptions, real prices.
- **The full price list** — every brand, variant, and package from `/pricing`,
  verbatim, including the "By Consultation" row and the nett-price footnote.
- **Doctor bios** — verbatim, including Dr. Jessika Sobaevana's full name.
- **Clinic facts** — the licence statement and number
  (`Sertifikat Standar No. 16112100281550002`), the philosophy, and the three
  published safety protocols.
- **All photography** — 53 files copied from the client's own WordPress media
  library into `public/images/` (not hotlinked).

**URLs match the live site**, which matters for SEO:

| Route | Notes |
| --- | --- |
| `/` | Home |
| `/ubud-bali` | Treatments index (the live site's own URL) |
| `/ubud-bali/[...slug]` | 27 treatment pages. Catch-all because five real paths are two segments deep (`hifu/body`, `prp/hair`, `microneedling/rf`, `facial/medi`, `botox/korean`) |
| `/our-doctor` | About / doctors (the live site's own URL) |
| `/pricing` | Full price list — 236 rows, verbatim |
| `/before-after` | Results |
| `/special-offers` | Botox discounts, transfer service, airline staff rates |
| `/gift-card` | Denominations + terms |
| `/our-blog` | All 10 posts from the live blog |
| `/book-now` | Booking form with date/time |
| `/privacy-policy` | Verbatim |
| `/terms-conditions` | Verbatim |

**38 internal URLs, zero 404s** — verified by crawling from the homepage.

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
- **27 treatments, ~13 photographs.** Any "fall back to the category image"
  scheme repeats the same photo several times per page, so a treatment with no
  photo of its own gets a deliberate typographic tile
  (`components/shared/TreatmentThumb.tsx`) instead. Verified: 0 duplicate images
  across all 27 treatment pages.

## Things that still need the client

- **11 treatments have no long-form copy.** They render the clinic's own
  description, real prices, and category, then say plainly that the full guide is
  being written, with a WhatsApp link. No medical information is invented.
- **Treatments with no photo** fall back to their category image. Missing:
  Microneedling, IPL, Muscle Sculpting, Pelvic Floor, IPL Hair Removal, Fat
  Dissolving, Carboxy Therapy, PRP Hair, Hair Mesotherapy, IV Drip.
- **The clinic has exactly one before/after asset.** `/before-after` shows that
  one result large and says so, rather than padding a grid with clinic interiors
  dressed up as results. Needs real photography plus written per-patient consent.
- **Testimonials** in `src/data/testimonials.ts` are original sample quotes, not
  the clinic's real reviews. Replace the data file; no code changes needed.
- **3 blog articles are not migrated.** "Skin Clinic Bali", "Nucleofill vs
  Rejuran", and "How Many Units of Botox for Forehead?" are listed on
  `/our-blog` but link to the clinic's current site. Their bodies sit inside
  collapsible components that couldn't be extracted in full, and these are
  articles quoting Botox dosages, brow-drop risk, and per-unit pricing —
  publishing a truncated or paraphrased version would be worse than linking out.
  Migrate the full text with a doctor's sign-off, then flip `external` off in
  `src/data/blog.ts`.
- **No booking backend.** Both the enquiry form and `/book-now` compose a
  WhatsApp message and hand off — WhatsApp is the clinic's real booking channel.
  `handleSubmit` in `components/shared/ContactForm.tsx` is the one function to
  replace. Gift-card denominations do the same rather than faking a checkout.
