"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveDocumentAction, type SaveState } from "../actions";
import ImageField from "./ImageField";
import ArticleBlocksField from "./ArticleBlocksField";
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

function FieldInput({
  field,
  data,
  library,
}: {
  field: Field;
  data: Record<string, unknown>;
  library: LibraryImage[];
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
        <textarea name={field.name} rows={field.rows ?? 4} defaultValue={value} className={areaClass} />
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
        className={inputClass}
      />
      {help}
    </label>
  );
}

function SaveBar({ status }: { status: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-gutter mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline bg-paper px-gutter py-4">
      <label className="flex items-center gap-3">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          Status
        </span>
        <select
          name="__status"
          defaultValue={status}
          className="border-b border-hairline bg-transparent py-1 font-sans text-label text-ink outline-none focus:border-primary"
        >
          <option value="published">Published</option>
          <option value="draft">Draft — hidden from the site</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center rounded-brand bg-primary-strong px-6 py-2.5 font-sans text-caption font-semibold uppercase tracking-caps-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export default function DocumentForm({
  collection,
  slug,
  data,
  status,
  library,
}: {
  collection: Collection;
  slug: string;
  data: Record<string, unknown>;
  status: "draft" | "published";
  /** Uploaded images, for the picker on image fields. */
  library: LibraryImage[];
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(saveDocumentAction, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="__collection" value={collection.id} />
      <input type="hidden" name="__slug" value={slug} />

      <div className="flex max-w-3xl flex-col gap-8">
        {collection.fields.map((field) => (
          <FieldInput key={field.name} field={field} data={data} library={library} />
        ))}
      </div>

      {state.error && (
        <p
          role="alert"
          className="mt-8 max-w-3xl border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
        >
          {state.error}
        </p>
      )}
      {state.ok && (
        <p
          role="status"
          className="mt-8 max-w-3xl border-l-2 border-primary bg-wash py-3 pl-4 font-sans text-label leading-relaxed text-ink"
        >
          {state.ok}
        </p>
      )}

      <SaveBar status={status} />
    </form>
  );
}
