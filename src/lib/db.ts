import { Pool } from "pg";
import type { QueryResultRow } from "pg";

/**
 * The one place a Postgres connection is opened.
 *
 * ── WHY `pg` AND NOT A NEON-SPECIFIC DRIVER ───────────────────────────
 * Neon publishes `@neondatabase/serverless`, which talks HTTP instead of
 * TCP and is a little faster to cold-start. It is also Neon-only. `pg`
 * speaks to Neon's pooled endpoint perfectly well and to any other
 * Postgres unchanged, which matters because this project has already
 * moved host once. Nothing below is Neon-specific.
 *
 * ── WHY A MODULE-LEVEL SINGLETON, AND WHY IT IS GUARDED ───────────────
 * A serverless function is frozen and thawed between requests, so the pool
 * has to outlive the handler or every request pays a new TLS handshake.
 * Module scope does that. In dev it would do it too well: Next's hot
 * reload re-evaluates this module on every save, and each evaluation would
 * open another pool that never closes, until Postgres refuses connections.
 * Stashing it on `globalThis` keeps exactly one across reloads.
 *
 * ── CONNECTION LIMITS ─────────────────────────────────────────────────
 * `max: 1` is deliberate. Each serverless invocation is its own process,
 * so a pool of 10 per invocation multiplies by however many run at once
 * and exhausts the database's connection cap long before the site is
 * under real load. One connection per invocation, with Neon's pooler
 * doing the actual pooling, is the arrangement that scales.
 */
declare global {
  var __hlaPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in — " +
        "see the notes there for where to get a Neon connection string.",
    );
  }
  return new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Neon (and every managed Postgres) requires TLS. `rejectUnauthorized`
    // stays off because the pooled endpoint presents a certificate for a
    // hostname that does not match the one in the connection string; the
    // channel is still encrypted. A self-hosted Postgres with a proper
    // certificate can drop this whole option.
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
}

export function pool(): Pool {
  if (!global.__hlaPool) global.__hlaPool = createPool();
  return global.__hlaPool;
}

/** Parameterised query. Never interpolate values into the SQL string. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await pool().query<T>(text, params);
  return result.rows;
}

/** The first row, or null. For lookups by a unique key. */
export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/**
 * Run several statements as one unit.
 *
 * Used where a single user action touches more than one row and a partial
 * result would be wrong — creating a user and their first session, or
 * saving a document and its revision together.
 */
export async function transaction<T>(fn: (q: typeof query) => Promise<T>): Promise<T> {
  const client = await pool().connect();
  try {
    await client.query("BEGIN");
    const scoped = async <R extends QueryResultRow = QueryResultRow>(
      text: string,
      params: unknown[] = [],
    ) => (await client.query<R>(text, params)).rows;
    const result = await fn(scoped as typeof query);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/** True when the app has a database configured at all. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
