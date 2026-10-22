/**
 * Puts the six staging icons back on "What can be treated with Mesotherapy in Ubud Bali?"
 * in the Personalized Mesotherapy article.
 *
 * Each icon goes directly before its label heading, the order staging builds them in. The
 * article renderer draws a run of picture + heading pairs as an icon list (see groupBlocks in
 * SanityPortableText.tsx). Deploy that before publishing: older code shows each icon at
 * full column width.
 *
 * Default is a dry run. --apply writes a DRAFT. --publish also publishes it.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createClient } = require('@sanity/client');
const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8').split('\n')) {
  const m = line.trim().match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
}
const client = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-02-19', token: env.SANITY_API_WRITE_TOKEN, useCdn: false, perspective: 'raw' });
const publish = process.argv.includes('--publish');
const apply = publish || process.argv.includes('--apply');
const ID = 'post.personalize-mesotherapy-ubud-bali';
const ICONS = [
  ['Melasma & Pigmentation', '2023/10/15.png', 'Icon of a face with pigmentation spots'],
  ['Enlarged Pores & Blemishes', '2023/10/13.png', 'Icon of an enlarged pore'],
  ['Aging', '2023/10/14.png', 'Icon of a face, half with wrinkles'],
  ['Dry & Dull Skin', '2023/10/20.png', 'Icon of a face with dry skin'],
  ['Hair Loss & Thinning', '2023/10/18.png', 'Icon of a thinning hair parting'],
  ['Cellulite & Stretch Mark', '2023/10/16.png', 'Icon of a waist with stretch marks'],
];
const key = seed => crypto.createHash('sha1').update(seed).digest('hex').slice(0, 12);
const text = b => (b.children || []).map(c => c.text || '').join('').trim();
const isHeading = b => b?._type === 'block' && /^h\d$/.test(b.style || '');

async function assetFor(file) {
  const id = `staging-wp:${file}`;
  const existing = await client.fetch('*[_type == "sanity.imageAsset" && source.id == $id][0]._id', { id });
  if (existing) return existing;
  if (!apply) return `(upload ${file})`;
  const url = `https://staging.healthylook-aesthetic.com/wp-content/uploads/${file}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {
    filename: path.basename(file), source: { name: 'Staging WordPress', id, url } });
  return asset._id;
}

(async () => {
  const [pub, draft] = await Promise.all([client.getDocument(ID), client.getDocument(`drafts.${ID}`)]);
  const base = draft || pub;
  const body = structuredClone(base.body);
  let added = 0;
  for (const [label, file, alt] of ICONS) {
    const at = body.findIndex(b => isHeading(b) && text(b) === label);
    if (at === -1) throw new Error(`No "${label}" heading`);
    if (body[at - 1]?._type === 'imageWithAlt') { console.log(`already has an icon: ${label}`); continue; }
    const ref = await assetFor(file);
    body.splice(at, 0, { _key: key(`${ID}:icon:${file}`), _type: 'imageWithAlt', asset: { _type: 'reference', _ref: ref }, alt, uncropped: true });
    added += 1;
    console.log(`icon before "${label}" (${ref})`);
  }
  if (!apply) return console.log('\nDry run. --apply writes a draft, --publish publishes it.');

  const { _rev, _createdAt, _updatedAt, ...content } = base;
  let tx = client.transaction();
  if (publish) {
    tx = tx.patch(pub._id, p => p.ifRevisionId(pub._rev).unset(['_syncGuard']));
    if (draft) tx = tx.patch(draft._id, p => p.ifRevisionId(draft._rev).unset(['_syncGuard'])).delete(draft._id);
    tx = tx.createOrReplace({ ...content, _id: pub._id, body });
  } else if (added) {
    tx = draft ? tx.patch(draft._id, p => p.ifRevisionId(draft._rev).set({ body }))
      : tx.create({ ...content, _id: `drafts.${pub._id}`, body });
  }
  await tx.commit();
  console.log(publish ? 'Published.' : added ? 'Draft written.' : 'Nothing to write.');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
