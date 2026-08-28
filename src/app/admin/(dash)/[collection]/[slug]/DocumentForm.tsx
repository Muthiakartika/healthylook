"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveDocumentAction, type SaveState } from "../actions";
import ImageField from "./ImageField";
import ArticleBlocksField from "./ArticleBlocksField";
import SeoPanel from "./SeoPanel";
import type { Collection, Field } from "@/lib/collections";

export type LibraryImage = { url: string; filename: string; alt: string };

const inputClass =
  "mt-2 w-full border-b border-hairline bg-transparent py-2.5 font-sans text-copy text-ink outline-none transition-colors focus:border-primary";

const areaClass =
  "mt-2 w-full resize-y border border-hairline bg-paper p-3 font-sans text-copy leading-relaxed text-ink outline-none transition-colors focus:border-primary";

/** JSON and long lists are edited in a monospaced box — proportional type
 *  makes it impossible to see whether brackets line up. */
const codeClass =
  "mt-2 w-full resize-y border border-hairline bg-paper p-3 font-mono text-[13px] leading-relaxed text-ink outline-none transition-colors focus:border-primary";

function initial(field: Field, data: Record<string, unknown>): string {
  const value = data[field.name];
  if (value === undefined || value === null) return "";
  if (field.type === "stringList") {
    return Array.isArray(value) ? value.join("\n") : String(value);
  }
  if (field.type === "json") return JSON.stringify(value, null, 2);
  return String(value);
}

/** "3 hours ago", falling back to a date once it's been a while — same
 *  rhythm as WP's own "Last edited" line, without a live-ticking clock. */
function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function FieldInput({
  field,
  data,
  library,
  uploadsEnabled,
  onLiveChange,
}: {
  field: Field;
  data: Record<string, unknown>;
  library: LibraryImage[];
  uploadsEnabled: boolean;
  /** Reports every keystroke's value upward — used only by the field(s) the SEO panel reads. */
  onLiveChange?: (value: string) => void;
}) {
  const [value, setValue] = useState(() => initial(field, data));
  const [jsonError, setJsonError] = useState<string | null>(null);

  const label = (
    <span className="font-sans text-caption uppercase tracking-caps text-muted">
      {field.label}
      {field.required && <span className="ml-1 text-primary-strong">*</span>}
    </span>
  );

  const help = field.help && (
    <span className="mt-2 block measure font-sans text-micro leading-relaxed text-muted">
      {field.help}
    </span>
  );

  if (field.type === "articleBlocks") {
    return (
      <div>
        <ArticleBlocksField
          name={field.name}
          label={field.label}
          initial={data[field.name]}
        />
        {help}
      </div>
    );
  }

  if (field.type === "image") {
    return (
      <ImageField
        name={field.name}
        label={field.label}
        initial={value}
        help={field.help}
        library={library}
        uploadsEnabled={uploadsEnabled}
      />
    );
  }

  if (field.type === "select") {
    return (
      <label className="block">
        {label}
        <select
          name={field.name}
          defaultValue={String(data[field.name] ?? "")}
          className={inputClass}
        >
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {help}
      </label>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(data[field.name])}
          className="accent-[var(--color-primary-strong,#8a6d3b)]"
        />
        {label}
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="block">
        {label}
        <textarea
          name={field.name}
          rows={field.rows ?? 4}
          defaultValue={value}
          onChange={(e) => onLiveChange?.(e.target.value)}
          className={areaClass}
        />
        {help}
      </label>
    );
  }

  if (field.type === "stringList") {
    return (
      <label className="block">
        {label}
        <textarea
          name={field.name}
          rows={Math.min(12, Math.max(3, value.split("\n").length + 1))}
          defaultValue={value}
          className={codeClass}
        />
        <span className="mt-2 block font-sans text-micro text-muted">
          One per line. {field.help ?? ""}
        </span>
      </label>
    );
  }

  if (field.type === "json") {
    return (
      <label className="block">
        {label}
        {/* Validated as you type, not only on save: finding out about a
            stray comma after submitting a long article is the difference
            between a two-second fix and losing your place in it. */}
        <textarea
          name={field.name}
          rows={Math.min(30, Math.max(6, value.split("\n").length + 1))}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (!e.target.value.trim()) return setJsonError(null);
            try {
              JSON.parse(e.target.value);
              setJsonError(null);
            } catch (err) {
              setJsonError(err instanceof Error ? err.message : "Invalid JSON");
            }
          }}
          spellCheck={false}
          className={`${codeClass} ${jsonError ? "border-primary" : ""}`}
        />
        {jsonError ? (
          <span className="mt-2 block font-sans text-micro text-primary-strong">
            {jsonError}
          </span>
        ) : (
          help
        )}
      </label>
    );
  }

  return (
    <label className="block">
      {label}
      <input
        type={field.type === "number" ? "number" : "text"}
        name={field.name}
        defaultValue={value}
        onChange={(e) => onLiveChange?.(e.target.value)}
        className={inputClass}
      />
      {help}
    </label>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 inline-flex w-full items-center justify-center rounded-brand bg-primary-strong px-6 py-2.5 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

/** The right-hand "Post" panel: status, save, and everything the collection
 *  marks as metadata rather than body content — mirrors a WordPress post
 *  editor's sidebar, built from whichever fields actually exist here. */
function PostSidebar({
  status,
  updatedAt,
  sidebarFields,
  data,
  library,
  uploadsEnabled,
  showSeo,
  seoTitle,
  seoDescription,
  onDescriptionChange,
}: {
  status: "draft" | "published";
  updatedAt?: string;
  sidebarFields: Field[];
  data: Record<string, unknown>;
  library: LibraryImage[];
  uploadsEnabled: boolean;
  showSeo: boolean;
  seoTitle: string;
  seoDescription: string;
  onDescriptionChange: (value: string) => void;
}) {
  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
      <div className="border border-hairline bg-paper p-5">
        <h2 className="font-sans text-label font-semibold uppercase tracking-caps text-ink">
          Post
        </h2>
        {updatedAt && (
          <p className="mt-2 font-sans text-micro text-muted">
            Last edited {timeAgo(updatedAt)}.
          </p>
        )}

        <label className="mt-4 flex items-center justify-between gap-3">
          <span className="font-sans text-caption uppercase tracking-caps text-muted">
            Status
          </span>
          <select
            name="__status"
            defaultValue={status}
            className="border-b border-hairline bg-transparent py-1 font-sans text-label text-ink outline-none focus:border-primary"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </label>

        <SaveButton />
      </div>

      {showSeo && (
        <div className="border border-hairline bg-paper p-5">
          <h2 className="font-sans text-label font-semibold uppercase tracking-caps text-ink">
            SEO
          </h2>
          <p className="mt-1 font-sans text-micro leading-relaxed text-muted">
            Quick checks, not a real analysis engine — treat these as a nudge, not a rule.
          </p>
          <div className="mt-4">
            <SeoPanel title={seoTitle} description={seoDescription} />
          </div>
        </div>
      )}

      {sidebarFields.length > 0 && (
        <div className="flex flex-col gap-6 border border-hairline bg-paper p-5">
          {sidebarFields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              data={data}
              library={library}
              uploadsEnabled={uploadsEnabled}
              onLiveChange={field.name === "description" ? onDescriptionChange : undefined}
            />
          ))}
        </div>
      )}
    </aside>
  );
}

export default function DocumentForm({
  collection,
  slug,
  data,
  status,
  library,
  uploadsEnabled,
  updatedAt,
}: {
  collection: Collection;
  slug: string;
  data: Record<string, unknown>;
  status: "draft" | "published";
  /** Uploaded images, for the picker on image fields. */
  library: LibraryImage[];
  uploadsEnabled: boolean;
  /** Omitted for a document that hasn't been saved yet. */
  updatedAt?: string;
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveDocumentAction, {});

  const titleField = collection.fields.find((f) => f.name === collection.titleField);
  const descriptionField = collection.fields.find((f) => f.name === "description");
  const mainFields = collection.fields.filter(
    (f) => f.name !== collection.titleField && !f.sidebar,
  );
  const sidebarFields = collection.fields.filter((f) => f.sidebar);
  const showSeo = collection.fields.some((f) => f.type === "articleBlocks");

  const [titleLive, setTitleLive] = useState(() => (titleField ? initial(titleField, data) : ""));
  const [descriptionLive, setDescriptionLive] = useState(() =>
    descriptionField ? initial(descriptionField, data) : "",
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="__collection" value={collection.id} />
      <input type="hidden" name="__slug" value={slug} />

      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-8">
          {titleField && (
            <label className="block border-b border-hairline pb-4">
              <span className="sr-only">{titleField.label}</span>
              <input
                name={titleField.name}
                defaultValue={titleLive}
                onChange={(e) => setTitleLive(e.target.value)}
                placeholder={`Add ${titleField.label.toLowerCase()}`}
                required={titleField.required}
                className="w-full border-none bg-transparent font-sans text-h3 font-semibold text-ink outline-none placeholder:text-muted/60"
              />
            </label>
          )}

          {mainFields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              data={data}
              library={library}
              uploadsEnabled={uploadsEnabled}
            />
          ))}

          {state.error && (
            <p
              role="alert"
              className="border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
            >
              {state.error}
            </p>
          )}
          {state.ok && (
            <p
              role="status"
              className="border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
            >
              {state.ok}
            </p>
          )}
        </div>

        <PostSidebar
          status={status}
          updatedAt={updatedAt}
          sidebarFields={sidebarFields}
          data={data}
          library={library}
          uploadsEnabled={uploadsEnabled}
          showSeo={showSeo}
          seoTitle={titleLive}
          seoDescription={descriptionLive}
          onDescriptionChange={setDescriptionLive}
        />
      </div>
    </form>
  );
}
