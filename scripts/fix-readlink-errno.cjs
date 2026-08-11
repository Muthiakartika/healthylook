/**
 * Build-time shim for a non-conforming filesystem.
 *
 * The volume this project sits on (D:, which Windows reports as
 * `FileSystemType: Unknown` rather than NTFS) returns the wrong errno from
 * readlink. For a regular file — any regular file, `package.json` included —
 * POSIX and every normal Windows volume return EINVAL, meaning "not a
 * symlink". This one returns EISDIR:
 *
 *   C:  fs.readlinkSync('a-regular-file.txt')  ->  EINVAL   ✓
 *   D:  fs.readlinkSync('a-regular-file.txt')  ->  EISDIR   ✗
 *
 * Webpack calls readlink on everything it touches, in both its resolver and
 * its snapshot/caching layer, and only handles EINVAL. On EISDIR it aborts:
 *
 *   Error: EISDIR: illegal operation on a directory, readlink '…/icon.svg'
 *
 * The filename in that error is meaningless — move that file and the message
 * names the next one, including files inside node_modules/next itself.
 * `next dev` is unaffected; this only ever breaks `next build`.
 *
 * This must be loaded with `node --require`, not from next.config.ts: Next
 * runs the compilation in worker processes, and a patch applied inside the
 * config file never reaches them. package.json's `build` script wires it up
 * via NODE_OPTIONS, which every child process inherits.
 *
 * ── THIS IS A WORKAROUND, NOT A FIX ──────────────────────────────────
 * The real fix is to move the repository onto a normal NTFS volume. Once it
 * is there, delete this file and drop NODE_OPTIONS from the build script.
 */
const fs = require("node:fs");

const EINVAL = -4071; // libuv's errno for EINVAL on Windows

function normalise(err) {
  if (err && err.code === "EISDIR" && err.syscall === "readlink") {
    err.code = "EINVAL";
    err.errno = EINVAL;
    err.message = err.message.replace("EISDIR:", "EINVAL:");
  }
  return err;
}

const realSync = fs.readlinkSync;
fs.readlinkSync = function readlinkSync(...args) {
  try {
    return realSync.apply(fs, args);
  } catch (err) {
    throw normalise(err);
  }
};

const real = fs.readlink;
fs.readlink = function readlink(...args) {
  const cb = args[args.length - 1];
  if (typeof cb !== "function") return real.apply(fs, args);
  args[args.length - 1] = (err, ...rest) => cb(err ? normalise(err) : null, ...rest);
  return real.apply(fs, args);
};

if (fs.promises && fs.promises.readlink) {
  const realPromise = fs.promises.readlink;
  fs.promises.readlink = async function readlink(...args) {
    try {
      return await realPromise.apply(fs.promises, args);
    } catch (err) {
      throw normalise(err);
    }
  };
}
