/**
 * The Mesotherapy article's "Mesotherapy" and "Other Treatments" lists become one two-column table.
 *
 * On staging they are two one-column tables side by side, each under its own h3, and their rows
 * pair up (Minimally invasive / Varying degrees of invasiveness). restore-blog-text.cjs carried
 * them over as two separate tables with one column each, which reads oddly and which Studio
 * refuses ("Column headings: must have at least 2 items"), so an editor could not save the post.
 * The two h3s become the column headings. No text is added or lost.
 *
 * Also corrects restore-blog-text.data.json, so a re-run of that script cannot bring the
 * one-column tables back. Default is a dry run. --apply writes the published post (and a draft,
 * if one exists).
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
const apply = process.argv.includes('--apply');
const ID = 'post.mesotherapy-for-rejuvenating-skin-hair';
const DATA = path.join(__dirname, 'restore-blog-text.data.json');
const key = seed => crypto.createHash('sha1').update(seed).digest('hex').slice(0, 16);
const text = b => (b.children || []).map(c => c.text || '').join('').trim();
const isH3 = (b, title) => b?._type === 'block' && b.style === 'h3' && text(b) === title;
const oneColumn = b => b?._type === 'treatmentTable' && (b.columns || []).length === 1;

/** Returns the body with the pair merged, or null when it is not there (already fixed). */
function merge(body) {
  const at = body.findIndex((b, i) => isH3(b, 'Mesotherapy') && oneColumn(body[i + 1])
    && isH3(body[i + 2], 'Other Treatments') && oneColumn(body[i + 3]));
  if (at === -1) return null;
  const [, left, , right] = body.slice(at, at + 4);
  // Each one-column table's "heading" is really its first item.
  const list = t => [t.columns[0], ...(t.rows || []).map(r => (r.cells || [])[0] ?? '')];
  const a = list(left), b = list(right);
  const table = {
    _key: left._key,
    _type: 'treatmentTable',
    columns: ['Mesotherapy', 'Other Treatments'],
    // Peers, not a comparison keyed on the first column: see labelFirstColumn in treatmentSection.ts.
    labelFirstColumn: false,
    rows: Array.from({ length: Math.max(a.length, b.length) }, (_, i) => ({
      _key: key(`${left._key}:row:${i}`), _type: 'treatmentTableRow', cells: [a[i] ?? '', b[i] ?? ''] })),
  };
  return [...body.slice(0, at), table, ...body.slice(at + 4)];
}

(async () => {
  const docs = (await client.fetch('*[_id in [$id, "drafts." + $id]]', { id: ID })).filter(Boolean);
  const changes = docs.map(doc => ({ doc, body: merge(doc.body || []) })).filter(c => c.body);
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const spec = data.documents.find(d => d.slug === 'mesotherapy-for-rejuvenating-skin-hair');
  const specBody = merge(spec.body);
  for (const { doc, body } of changes) {
    const t = body.find(b => b._type === 'treatmentTable' && b.columns[0] === 'Mesotherapy');
    console.log(`${doc._id}: ${doc.body.length} -> ${body.length} blocks`);
    for (const r of t.rows) console.log(`   ${r.cells[0].padEnd(66)} | ${r.cells[1]}`);
  }
  console.log(specBody ? 'restore-blog-text.data.json: will be corrected' : 'restore-blog-text.data.json: already correct');
  if (!changes.length) console.log('Sanity: nothing to fix.');
  if (!apply) return console.log('\nDry run. --apply to write.');

  let tx = client.transaction();
  for (const { doc, body } of changes) tx = tx.patch(doc._id, p => p.ifRevisionId(doc._rev).set({ body }));
  if (changes.length) await tx.commit();
  if (specBody) {
    spec.body = specBody;
    fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + '\n');
  }
  console.log(`\nFixed ${changes.length} document(s).`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
