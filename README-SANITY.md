# Sanity content system

The website keeps its existing React components, Tailwind tokens, fonts, spacing, and responsive behaviour. Sanity supplies structured content and section order; it never stores CSS or arbitrary HTML.

Until `NEXT_PUBLIC_SANITY_PROJECT_ID` is configured, or when a matching Sanity document has not been published, public pages continue to use the existing local/Postgres content. This makes migration incremental and prevents an incomplete dataset from blanking the site.

## 1. Create and connect the Sanity project

1. Create a project and `production` dataset in [Sanity Manage](https://www.sanity.io/manage).
2. Copy `.env.example` to `.env.local` and set:

   ```dotenv
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
   NEXT_PUBLIC_SANITY_STUDIO_URL=/studio
   SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3006
   SANITY_API_READ_TOKEN=viewer-token
   SANITY_REVALIDATE_SECRET=a-long-random-secret
   SANITY_API_WRITE_TOKEN=editor-token-for-migration-only
   ```

3. In Sanity Manage → API → CORS Origins, add the production website origin with credentials enabled. Add `http://localhost:3006` only for local preview work.
4. Open `/studio` from the website deployment, or deploy the Studio separately with `npm run sanity:deploy`.

The current `/admin` CMS is intentionally left intact during transition. Remove it only after content and editorial workflows have been accepted in production.

## 2. Bootstrap existing content

Run once after logging in with `npm run sanity -- login`, or supply `SANITY_API_WRITE_TOKEN`:

```bash
npm run sanity:migrate
```

The migration:

- uploads local treatment and doctor images to Sanity;
- creates treatments, treatment sections, FAQs, prices, doctors, testimonials, blog categories, and posts;
- creates the homepage and every main static route under **Pages**;
- migrates each inner page into real editable blocks (hero, rich text, split
  content, grids, galleries, forms, and collection-backed sections);
- uses deterministic document IDs and creates missing documents only, so rerunning does not overwrite editor changes.

To deliberately replace migrated documents with source data:

```bash
npx sanity exec scripts/sanity/migrate.ts --with-user-token -- --replace
```

Note the second `--`, and why the obvious `npm run sanity:migrate -- --replace`
does not work: npm consumes its own `--`, so `sanity exec` receives `--replace`
as an option of its own, does not recognise it, and drops it before the script
runs. The migration then completes reporting "create missing documents only"
and silently changes nothing — which looks like success. Check that first line
of output says `Migration mode: replace existing documents` before believing a
replace run did anything.

Use `--replace` only when discarding subsequent Studio edits is intended. Note
that `Page` documents are exempt either way: migrateInnerPages skips any page
that is no longer the generated placeholder, with or without the flag, so a
replace run cannot overwrite a page an editor has arranged.

## 3. Editing model

`Page` documents contain an ordered `sections` array. Editors can add, remove, hide, and reorder:

- hero;
- rich text;
- text with image;
- feature cards;
- gallery;
- FAQ;
- call to action;
- an existing styled website section.

Background and layout choices are controlled enums. Editors cannot enter CSS classes, scripts, or unrestricted HTML.

Treatments remain separate structured documents because prices, treatment time, downtime, results, practitioner, and clinical FAQs should not be free-form page blocks. Blog posts use Portable Text and have their own cover image, category, publication date, and SEO fields.

## 4. Preview and publishing

The Presentation tool loads `SANITY_STUDIO_PREVIEW_ORIGIN` and enables Next.js Draft Mode through `/api/draft-mode/enable`. `SANITY_API_READ_TOKEN` must be a Viewer token and must never use the `NEXT_PUBLIC_` prefix.

Published changes are picked up by Sanity Live. A webhook is also available as
the immediate, deterministic cache invalidation path. The site has a 60-second
ISR fallback, so a missed webhook cannot freeze published content indefinitely:

- URL: `https://your-domain.example/api/revalidate/sanity`
- Method: `POST`
- Header: `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`
- Projection:

  ```groq
  {
    _type,
    path,
    "slug": slug.current
  }
  ```

Trigger it for create, update, and delete events on `page`, `post`, `treatment`, `doctor`, and `testimonial` documents.

Confirm the webhook exists with `npm run sanity -- hook list`. An empty result
means there is no instant production invalidation yet.

## 5. Type safety

Schema modules live in `src/sanity/schemaTypes`, queries in `src/sanity/lib/queries.ts`, handwritten runtime contracts in `src/sanity/types.ts`, and rendering in `src/components/sanity`.

After changing a schema or GROQ projection, regenerate schema-derived query types:

```bash
npm run sanity:typegen
```

Then run:

```bash
npm run lint
npm exec tsc -- --noEmit
npm run build
```

When adding a page-builder section, add its schema, discriminated TypeScript type, GROQ projection if it contains references, and renderer case together. Unknown section types intentionally render nothing instead of crashing the public site.
