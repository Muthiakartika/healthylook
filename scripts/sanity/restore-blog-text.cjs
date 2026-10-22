/** Restore staging article text/structure only. Default is dry run. --apply writes DRAFTS, never publishes. */
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@sanity/client');
const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '../../.env.local'), 'utf8').split('\n')) {
  const m = line.trim().match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
}
const client = createClient({ projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-02-19', token: env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN, useCdn: false, perspective: 'raw' });
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'restore-blog-text.data.json'), 'utf8'));
const canonical = value => JSON.stringify(value, (_, item) => item && !Array.isArray(item) && typeof item === 'object' ? Object.fromEntries(Object.entries(item).sort(([a],[b]) => a.localeCompare(b))) : item);
const apply = process.argv.includes('--apply');
const backupRoot = process.env.BLOG_RESTORE_BACKUP_DIR || 'C:/Users/asus/.codex/visualizations/2026/10/21/01a15d8b-86fd-7330-96c7-45772f2c85ac/blog-text-backups';
const norm = s => s.toLowerCase().replace(/https?:\/\/staging\./g, 'https://').replace(/[^\p{L}\p{N}]/gu, '');
const blockText = b => b._type === 'treatmentTable' ? [...(b.columns || []), ...(b.rows || []).flatMap(r => r.cells || [])].join(' ') : (b.children || []).map(c => c.text || '').join('');
(async () => {
  const all = await client.fetch('*[_type == "post"]');
  const changes = [];
  for (const spec of data.documents) {
    const pub = all.find(d => !d._id.startsWith('drafts.') && d.slug?.current === spec.slug);
    if (!pub) throw new Error(`No published post: ${spec.slug}`);
    const draft = all.find(d => d._id === `drafts.${pub._id}`);
    const base = draft || pub;
    const body = structuredClone(spec.body);
    const text = norm(body.map(blockText).join(' '));
    const missing = spec.sourceRootTexts.filter(t => !text.includes(norm(t)));
    if (missing.length) throw new Error(`${spec.slug}: source coverage failure`);
    const unrepresented = (base.body || []).filter(b => b._type === 'block' || b._type === 'treatmentTable').filter(b => !text.includes(norm(blockText(b))));
    if (unrepresented.length) throw new Error(`${spec.slug}: existing editorial text needs manual reconciliation: ${unrepresented.map(blockText).join(' | ')}`);
    // Preserve published non-text blocks only: the user cancelled draft-only blog image additions.
    for (let i = 0; i < (pub.body || []).length; i++) {
      const block = pub.body[i];
      if (['block', 'treatmentTable'].includes(block._type)) continue;
      let at = 0;
      for (let j = i - 1; j >= 0; j--) {
        const previous = norm(blockText(pub.body[j]));
        if (!previous) continue;
        const match = body.findLastIndex(b => norm(blockText(b)).includes(previous));
        if (match >= 0) { at = match + 1; break; }
      }
      body.splice(at, 0, structuredClone(block));
    }
    const summary = { slug: spec.slug, draftId: `drafts.${pub._id}`, before: base.body?.length || 0, after: body.length,
      tables: body.filter(b => b._type === 'treatmentTable').length, lists: body.filter(b => b.listItem).length,
      links: body.reduce((n, b) => n + (b.markDefs?.length || 0), 0), preservedNonText: body.filter(b => !['block','treatmentTable'].includes(b._type)).length,
      unchanged: canonical(base.body) === canonical(body) };
    changes.push({ pub, draft, base, body, summary });
  }
  console.log(JSON.stringify(changes.map(c => c.summary), null, 2));
  if (!apply) return;
  fs.mkdirSync(backupRoot, { recursive: true });
  const backup = path.join(backupRoot, `${new Date().toISOString().replace(/[:.]/g,'-')}.json`);
  fs.writeFileSync(backup, JSON.stringify(changes.map(({ pub, draft }) => ({ published: pub, draft: draft || null })), null, 2));
  // Validate every document before any write; revision guards reject concurrent edits.
  let tx = client.transaction();
  for (const { pub, draft, base, body, summary } of changes) {
    if (summary.unchanged) continue;
    if (draft) tx = tx.patch(draft._id, p => p.ifRevisionId(draft._rev).set({ body }));
    else {
      const { _rev, _createdAt, _updatedAt, ...clonable } = base;
      tx = tx.create({ ...clonable, _id: `drafts.${pub._id}`, body });
    }
  }
  await tx.commit();
  console.log(`Draft restoration complete. Backup: ${backup}`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
