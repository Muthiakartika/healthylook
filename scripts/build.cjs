/**
 * `npm run build` entry point.
 *
 * All this does is run `next build` with scripts/fix-readlink-errno.cjs
 * preloaded — see that file for why it is needed. It has to go through
 * NODE_OPTIONS rather than a plain `node --require`, because Next compiles
 * in worker processes and only NODE_OPTIONS is inherited by children.
 *
 * NODE_OPTIONS also can't be set inline in an npm script cross-platform
 * (`NODE_OPTIONS=... next build` is bash syntax and fails in cmd.exe), which
 * is the only reason this launcher exists rather than a one-line script.
 *
 * Once the repository lives on a normal NTFS volume, delete this file and
 * scripts/fix-readlink-errno.cjs, and set "build": "next build" again.
 */
const { spawnSync } = require("node:child_process");
const path = require("node:path");

// Forward slashes, not path.join's backslashes: NODE_OPTIONS is parsed as a
// shell-style string and treats `\` as an escape, so a Windows path arrives
// as "D:Document FileNext.js Data…" and the preload fails to resolve. Node
// accepts forward slashes on Windows, and the quotes cover the spaces.
const shim = path.join(__dirname, "fix-readlink-errno.cjs").replace(/\\/g, "/");
const prefix = process.env.NODE_OPTIONS ? `${process.env.NODE_OPTIONS} ` : "";

const result = spawnSync(
  process.execPath,
  [require.resolve("next/dist/bin/next"), "build", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: { ...process.env, NODE_OPTIONS: `${prefix}--require "${shim}"` },
  },
);

process.exit(result.status ?? 1);
