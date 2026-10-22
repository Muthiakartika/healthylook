/** Restore verified missing staging copy. Dry run by default; --apply writes drafts only. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createClient } = require('@sanity/client');

const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8').split('\n')) {
  const match = line.trim().match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
}
const client = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-02-19', token: env.SANITY_API_WRITE_TOKEN, useCdn: false, perspective: 'raw' });
const apply = process.argv.includes('--apply');
const artifactDir = process.env.CONTENT_AUDIT_DIR;
if (!artifactDir) throw new Error('Set CONTENT_AUDIT_DIR to a local folder for backups and verification artifacts.');
// Source copy captured from staging on 2026-10-21, keyed by its Oxygen element id.
const source = JSON.parse(fs.readFileSync(path.join(__dirname, 'restore-staging-page-text.data.json'), 'utf8'));
const sourceText = (url, id) => {
  const text = source.find(row => row.path === url)?.missingCandidates.find(row => row.sourceId === id)?.text;
  assert.ok(text && text.length > 30, `Missing verified source ${url}#${id}`);
  return text;
};
const block = (key, text, style = 'normal') => ({ _type: 'block', _key: key, style, markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, text, marks: [] }] });
const plain = value => JSON.stringify(value);

async function restore(id, edit) {
  const [published, draft] = await Promise.all([client.getDocument(id), client.getDocument(`drafts.${id}`)]);
  assert.ok(published, `Missing published document ${id}`);
  const base = draft || published;
  const sections = structuredClone(base.sections);
  if (!edit(sections)) { console.log(`${id}: already restored`); return; }
  assert.ok(sections.length >= base.sections.length, `${id}: section removed`);
  const backupDir = path.join(artifactDir, 'page-text-backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(path.join(backupDir, `${id}-${stamp}.json`), JSON.stringify({ published, draft }, null, 2));
  fs.writeFileSync(path.join(backupDir, `${id}-proposed.json`), JSON.stringify({ ...base, sections }, null, 2));
  if (!apply) { console.log(`${id}: ready (dry run; existing draft: ${!!draft})`); return; }
  if (draft) {
    await client.patch(draft._id).ifRevisionId(draft._rev).set({ sections }).commit();
  } else {
    // Recheck the published revision; create fails if an editor made a draft meanwhile.
    const { _rev, _createdAt, _updatedAt, ...copy } = published;
    assert.equal((await client.getDocument(id))._rev, _rev, `${id}: published content changed; rerun`);
    await client.create({ ...copy, _id: `drafts.${id}`, sections });
  }
  const saved = await client.getDocument(`drafts.${id}`);
  assert.deepEqual(saved.sections, sections);
  for (const key of Object.keys(base).filter(key => !['_id', '_rev', '_createdAt', '_updatedAt', 'sections'].includes(key))) {
    assert.deepEqual(saved[key], base[key], `${id}: unexpected metadata change ${key}`);
  }
  console.log(`${id}: draft restored and read back verified`);
}

(async () => {
  await restore('treatment.ipl', sections => {
    if (sections.some(s => s._key === 'staging-ipl-technology')) return false;
    const text = sourceText('/ubud-bali/ipl/', 'text_block-231-11');
    const parts = text.split(/\s+-\s*\t/);
    assert.equal(parts.length, 3, 'Unexpected IPL source format');
    sections.push({ _key: 'staging-ipl-technology', _type: 'treatmentSection', display: 'prose', tone: 'plain',
      blocks: [{ _key: 'staging-ipl-technology-copy', _type: 'treatmentContentBlock',
        body: parts.map((text, index) => ({ ...block(`staging-ipl-${index}`, text.trim()),
          ...(index ? { listItem: 'bullet', level: 1 } : {}) })) }] });
    return true;
  });
  await restore('treatment.prp', sections => {
    const text = sourceText('/ubud-bali/prp/', 'text_block-402-85');
    if (plain(sections).includes(text)) return false;
    const section = sections.find(s => s._key === 'section-003');
    assert.ok(section, 'PRP areas section no longer exists');
    section.blocks.push({ _key: 'staging-prp-scalp', _type: 'treatmentContentBlock', heading: 'Scalp',
      body: [block('staging-prp-scalp-copy', text)] });
    return true;
  });
  await restore('page.gift-card', sections => {
    if (sections.some(s => s._key === 'staging-gift-redemption')) return false;
    const text = sourceText('/gift-card/', 'text_block-80-879');
    const form = sections.findIndex(s => s._key === 'gift-form');
    assert.ok(form >= 0, 'Gift card form missing');
    sections.splice(form, 0, { _key: 'staging-gift-redemption', _type: 'richTextSection', tone: 'paper', align: 'left',
      width: 'standard', title: 'How do I redeem a Healthy Look Gift Card?', body: [block('staging-gift-redemption-copy', text)] });
    return true;
  });
})().catch(error => { console.error(error.message); process.exitCode = 1; });
