-- ─────────────────────────────────────────────────────────────────────
-- Healthy Look Aesthetic — admin/CMS schema
--
-- Applied by `npm run db:migrate`, which runs this file top to bottom.
-- Every statement is written to be safe to re-run, so migrating twice is
-- not a failure mode — there is no separate "has this run?" ledger to
-- drift out of sync with reality.
-- ─────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── PEOPLE ───────────────────────────────────────────────────────────
-- `role` is a plain text column with a CHECK rather than a Postgres ENUM.
-- Adding a third role to an ENUM needs ALTER TYPE and cannot run inside a
-- transaction on older Postgres; a CHECK is edited by dropping and adding
-- the constraint, which can.
CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL,
  name          text NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  -- Set when an admin creates the account; cleared once the person picks
  -- their own password. The login flow forces a change while it is true,
  -- so a handed-out temporary password cannot stay in use.
  must_change_password boolean NOT NULL DEFAULT true,
  disabled_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES users(id) ON DELETE SET NULL,
  last_login_at timestamptz
);

-- Case-insensitive uniqueness: "Irene@..." and "irene@..." are one person.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users (lower(email));

-- ── SESSIONS ─────────────────────────────────────────────────────────
-- Opaque server-side sessions rather than a signed JWT, because a JWT
-- cannot be revoked before it expires. An admin disabling an editor has
-- to log them out now, not in an hour.
--
-- Only the HASH of the token is stored. The cookie holds the token
-- itself, so a leaked database dump does not hand over live sessions.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  user_agent text
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

-- ── CONTENT ──────────────────────────────────────────────────────────
-- One row per editable thing, with the body kept as jsonb in the exact
-- shape the site's existing TypeScript types already describe.
--
-- ── WHY jsonb AND NOT FIFTEEN RELATIONAL TABLES ──────────────────────
-- The content this replaces is ~7,400 lines across fourteen files, and
-- its shapes are deeply nested and unlike each other: a treatment has
-- price groups containing rows, an article has an ordered list of typed
-- blocks, a section has bullets and prose blocks with optional headings.
-- Modelling each of those relationally means fifteen schemas, fifteen
-- sets of joins, and a migration every time the clinic wants one more
-- field. The site already has a validated description of every shape —
-- its TypeScript types — and jsonb lets those stay the single definition.
--
-- What is NOT in jsonb is anything the application needs to query or sort
-- by: collection, slug, status, timestamps. Those are real columns with
-- real indexes.
CREATE TABLE IF NOT EXISTS documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection   text NOT NULL,
  slug         text NOT NULL,
  data         jsonb NOT NULL,
  status       text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  -- Controls order on the site wherever the old data file's array order
  -- used to. Sparse (10, 20, 30…) so a row can be dragged between two
  -- others without renumbering the whole collection.
  position     integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  updated_by   uuid REFERENCES users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS documents_collection_slug_key
  ON documents (collection, slug);
CREATE INDEX IF NOT EXISTS documents_collection_position_idx
  ON documents (collection, position, slug);

-- ── REVISIONS ────────────────────────────────────────────────────────
-- Every save keeps the PREVIOUS body. Editors are being handed pages that
-- carry clinical claims and prices; "restore what it said yesterday" has
-- to be one click, not a database restore.
CREATE TABLE IF NOT EXISTS revisions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  data        jsonb NOT NULL,
  status      text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS revisions_document_id_idx
  ON revisions (document_id, created_at DESC);

-- ── MEDIA ────────────────────────────────────────────────────────────
-- Uploads live in Vercel Blob; this table is the catalogue an editor
-- browses. `url` is what the site renders, `pathname` is what deletes it.
CREATE TABLE IF NOT EXISTS media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url         text NOT NULL,
  pathname    text NOT NULL,
  filename    text NOT NULL,
  content_type text NOT NULL,
  size_bytes  integer NOT NULL,
  width       integer,
  height      integer,
  alt         text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS media_created_at_idx ON media (created_at DESC);

-- ── AUDIT ────────────────────────────────────────────────────────────
-- Who changed what, kept separately from revisions because it also
-- records things that have no document: logins, user creation, role
-- changes, deletions.
CREATE TABLE IF NOT EXISTS audit_log (
  id         bigserial PRIMARY KEY,
  user_id    uuid REFERENCES users(id) ON DELETE SET NULL,
  action     text NOT NULL,
  subject    text,
  detail     jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log (created_at DESC);
