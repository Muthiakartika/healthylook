/**
 * Bring the blog posts level with the staging WordPress articles and publish them.
 *
 * Text: restore-blog-text.cjs (2026-10-21) already rebuilt each article's tables,
 * lists and links from staging, but only as drafts. This publishes those drafts.
 * Pictures: adds the staging article photos (sync-blog-from-staging.data.json),
 * each after the paragraph it follows on staging. Icons stay out — rich text has
 * no icon layout, so an icon would show as wide as the column.
 *
 * liquid-lifting is left alone: an editor rewrote and published it in Studio on
 * 2026-10-22, so the staging version is no longer the one to match.
 *
 * Default is a dry run. --apply backs up, uploads missing pictures, and PUBLISHES.
 */
const fs = require('node:fs');
const os = require('node:os');
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
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'sync-blog-from-staging.data.json'), 'utf8'));
const textSlugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'restore-blog-text.data.json'), 'utf8')).documents.map(d => d.slug);
const SKIP = new Set(['liquid-lifting']);
const apply = process.argv.includes('--apply');
const backupRoot = process.env.BLOG_SYNC_BACKUP_DIR || path.join(os.homedir(), 'hla-sanity-backups');
const key = seed => crypto.createHash('sha1').update(seed).digest('hex').slice(0, 12);
const norm = s => (s || '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const blockText = b => b._type === 'treatmentTable'
  ? [...(b.columns || []), ...(b.rows || []).flatMap(r => r.cells || [])].join(' ')
  : (b.children || []).map(c => c.text || '').join('');
const isHeading = b => b._type === 'block' && /^h\d$/.test(b.style || '');

async function assetFor(p) {
  if (p.file.startsWith('image-')) return p.file; // an asset the audit matched to this staging picture
  const id = `staging-wp:${p.file}`;
  const existing = await client.fetch('*[_type == "sanity.imageAsset" && source.id == $id][0]._id', { id });
  if (existing) return existing;
  if (!apply) return `(upload ${p.file})`;
  const response = await fetch(p.url);
  if (!response.ok) throw new Error(`${response.status} ${p.url}`);
  const asset = await client.assets.upload('image', Buffer.from(await response.arrayBuffer()), {
    filename: path.basename(p.file), source: { name: 'Staging WordPress', id, url: p.url } });
  return asset._id;
}

(async () => {
  const me = await client.request({ uri: '/users/me' });
  if (!(me.roles || []).some(r => ['administrator', 'editor'].includes(r.name))) throw new Error(`Token "${me.name}" cannot write`);
  const all = await client.fetch('*[_type == "post"]');
  const changes = [];
  for (const slug of textSlugs.filter(s => !SKIP.has(s))) {
    const pub = all.find(d => !d._id.startsWith('drafts.') && d.slug?.current === slug);
    if (!pub) throw new Error(`No published post: ${slug}`);
    const draft = all.find(d => d._id === `drafts.${pub._id}`);
    const base = draft || pub;
    const body = structuredClone(base.body || []);
    const notes = [];
    let cursor = 0;
    let lastAnchor;
    for (const p of data.posts[slug] || []) {
      const ref = await assetFor(p);
      if (body.some(b => b._type === 'imageWithAlt' && b.asset?._ref === ref)) { notes.push(`already shows ${p.staging}`); continue; }
      let at;
      if (p.after === lastAnchor && p.after !== undefined) at = cursor;
      else if (p.after === null) {
        // Straight under the title on staging. Here the cover already sits there,
        // so the picture goes after the intro, before the first heading.
        const h = body.findIndex(isHeading);
        at = h === -1 ? Math.min(1, body.length) : h;
      } else {
        const want = norm(p.after);
        const i = body.findIndex(b => { const t = norm(blockText(b)); return t && (t.includes(want) || (t.length > 30 && want.includes(t))); });
        if (i === -1) throw new Error(`${slug}: no block for "${p.after.slice(0, 60)}"`);
        at = i + 1;
      }
      body.splice(at, 0, { _key: key(`${pub._id}:${p.staging}`), _type: 'imageWithAlt', asset: { _type: 'reference', _ref: ref }, alt: p.alt, uncropped: true });
      cursor = at + 1;
      lastAnchor = p.after;
      notes.push(`image ${p.staging} at ${at} after "${(p.after || '(intro)').slice(0, 50)}"`);
    }
    changes.push({ slug, pub, draft, body, notes });
  }
  for (const c of changes) {
    console.log(`${c.slug}: ${c.draft ? 'publish draft' : 'published only'}, ${c.body.length} blocks, ` +
      `${c.body.filter(b => b._type === 'treatmentTable').length} tables, ${c.body.filter(b => b._type === 'imageWithAlt').length} pictures`);
    for (const n of c.notes) console.log(`   ${n}`);
  }
  if (!apply) return console.log('\nDry run. --apply to back up and publish.');

  fs.mkdirSync(backupRoot, { recursive: true });
  const backup = path.join(backupRoot, `blog-sync-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(backup, JSON.stringify(changes.map(({ pub, draft }) => ({ published: pub, draft: draft || null })), null, 2));
  // Revision guards: if anyone saves one of these in Studio meanwhile, nothing is written.
  let tx = client.transaction();
  for (const { pub, draft, body } of changes) {
    const { _rev, _createdAt, _updatedAt, ...content } = draft || pub;
    tx = tx.patch(pub._id, p => p.ifRevisionId(pub._rev).unset(['_syncGuard']));
    if (draft) tx = tx.patch(draft._id, p => p.ifRevisionId(draft._rev).unset(['_syncGuard']));
    tx = tx.createOrReplace({ ...content, _id: pub._id, body });
    if (draft) tx = tx.delete(draft._id);
  }
  await tx.commit();
  console.log(`\nPublished ${changes.length} posts. Backup: ${backup}`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
