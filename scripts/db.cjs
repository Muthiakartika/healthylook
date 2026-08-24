/**
 * Database CLI — `npm run db:migrate`, `npm run db:admin`, `npm run db:seed`.
 *
 * Plain CommonJS run by node directly, not through Next. It has to work
 * before the app does: creating the schema and the first admin are the
 * two things you cannot do from a dashboard you cannot yet log into.
 *
 * ── WHY IT READS .env.local ITSELF ────────────────────────────────────
 * Next loads .env.local automatically; a bare `node` process does not, and
 * adding `dotenv` for four lines of parsing is a dependency for nothing.
 */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const readline = require("node:readline");

const ROOT = path.join(__dirname, "..");

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
      if (!m) continue;
      let value = m[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[m[1]] === undefined) process.env[m[1]] = value;
    }
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error(
    "\n  DATABASE_URL is not set.\n\n" +
      "  1. Create a free Postgres at https://neon.tech\n" +
      "  2. Copy the POOLED connection string (it has `-pooler` in the host)\n" +
      "  3. Put it in .env.local as DATABASE_URL=postgres://...\n",
  );
  process.exit(1);
}

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

/* ── scrypt hashing, byte-for-byte the same format as src/lib/auth.ts ── */
function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

function ask(question, { hidden = false } = {}) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    if (!hidden) {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
      return;
    }
    // Suppress echo so a password is not left in the terminal scrollback.
    const onData = (char) => {
      if (["\n", "\r", ""].includes(char.toString())) {
        process.stdin.removeListener("data", onData);
        return;
      }
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(question + "*".repeat(rl.line.length));
    };
    process.stdout.write(question);
    process.stdin.on("data", onData);
    rl.question("", (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

async function migrate() {
  const sql = fs.readFileSync(path.join(ROOT, "src", "lib", "schema.sql"), "utf8");
  await pool.query(sql);
  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' ORDER BY table_name`,
  );
  console.log("\n  Schema applied. Tables now present:");
  for (const t of tables.rows) console.log("    - " + t.table_name);
  console.log();
}

async function createAdmin() {
  const email = process.argv[3] || (await ask("  Admin email: "));
  const name = process.argv[4] || (await ask("  Full name: "));

  const existing = await pool.query(`SELECT id FROM users WHERE lower(email) = lower($1)`, [
    email,
  ]);

  const password =
    process.argv[5] ||
    (await ask("  Password (min 10 chars, will not be shown): ", { hidden: true }));

  if (password.length < 10) {
    console.error("\n  Password must be at least 10 characters.\n");
    process.exit(1);
  }

  const hash = hashPassword(password);

  if (existing.rows.length) {
    // Promoting/repairing an existing account is the common case when
    // someone has locked themselves out, so it is not an error.
    await pool.query(
      `UPDATE users
          SET password_hash = $2, role = 'admin', must_change_password = false,
              disabled_at = NULL, name = COALESCE(NULLIF($3, ''), name)
        WHERE id = $1`,
      [existing.rows[0].id, hash, name],
    );
    console.log(`\n  Updated ${email} — now an active admin with the new password.\n`);
  } else {
    await pool.query(
      `INSERT INTO users (email, name, password_hash, role, must_change_password)
       VALUES ($1, $2, $3, 'admin', false)`,
      [email, name || email, hash],
    );
    console.log(`\n  Created admin ${email}. Sign in at /admin/login\n`);
  }
}

/**
 * Answers "is this wired up, and what is in it" in one command.
 *
 * Worth its own entry because the failure it diagnoses is confusing from
 * the app's side: a wrong connection string, an unmigrated database and an
 * empty one all look identical at /admin — a login page that will not let
 * you in, with no way to tell which of the three is wrong.
 */
async function check() {
  const server = await pool.query(`SELECT current_database() AS db, version() AS version`);
  const version = server.rows[0].version.split(" ").slice(0, 2).join(" ");
  console.log(`\n  Connected to "${server.rows[0].db}" — ${version}`);

  const expected = ["users", "sessions", "documents", "revisions", "media", "audit_log"];
  const present = new Set(
    (
      await pool.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      )
    ).rows.map((r) => r.table_name),
  );
  const missing = expected.filter((t) => !present.has(t));

  if (missing.length) {
    console.log(`\n  Schema NOT applied. Missing: ${missing.join(", ")}`);
    console.log("  Run: npm run db:migrate\n");
    return;
  }
  console.log("  Schema applied — all six tables present.");

  const admins = await pool.query(
    `SELECT count(*) FROM users WHERE role = 'admin' AND disabled_at IS NULL`,
  );
  const users = await pool.query(`SELECT count(*) FROM users`);
  const docs = await pool.query(
    `SELECT collection, count(*) AS n FROM documents GROUP BY collection ORDER BY collection`,
  );
  const media = await pool.query(`SELECT count(*) FROM media`);

  console.log(`\n  People:  ${users.rows[0].count} (${admins.rows[0].count} active admin)`);
  if (Number(admins.rows[0].count) === 0) {
    console.log("           No admin yet — run: npm run db:admin");
  }

  if (docs.rows.length === 0) {
    console.log("  Content: none imported — sign in and use the Import screen");
  } else {
    console.log("  Content:");
    for (const row of docs.rows) {
      console.log(`           ${row.collection.padEnd(20)} ${row.n}`);
    }
  }
  console.log(`  Images:  ${media.rows[0].count}\n`);
}

async function main() {
  const command = process.argv[2];
  try {
    if (command === "migrate") await migrate();
    else if (command === "admin") await createAdmin();
    else if (command === "check") await check();
    else {
      console.log(
        "\n  Usage:\n" +
          "    npm run db:check              connection, schema and content status\n" +
          "    npm run db:migrate            apply src/lib/schema.sql\n" +
          "    npm run db:admin              create or repair an admin account\n",
      );
    }
  } catch (error) {
    console.error("\n  " + (error && error.message ? error.message : error) + "\n");
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
