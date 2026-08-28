"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { bulkDeleteAction, bulkSetStatusAction } from "./actions";

export type CollectionRow = {
  slug: string;
  title: string;
  status: "draft" | "published";
  updatedAt: string;
  columns: { name: string; value: string }[];
};

/**
 * The list view: a WordPress-style table with row checkboxes, a bulk
 * actions bar, and Edit/Delete links that appear on row hover.
 *
 * A client component so selection state and the bulk-action bar can live
 * here; the data itself is still fetched server-side in page.tsx and
 * handed down as plain, serialisable rows.
 */
export default function CollectionTable({
  collectionId,
  titleColumnLabel,
  columnLabels,
  rows,
  canDelete,
}: {
  collectionId: string;
  titleColumnLabel: string;
  columnLabels: { name: string; label: string }[];
  rows: CollectionRow[];
  canDelete: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [pending, startTransition] = useTransition();
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const allSelected = rows.length > 0 && selected.size === rows.length;
  const someSelected = selected.size > 0 && !allSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) headerCheckboxRef.current.indeterminate = someSelected;
  }, [someSelected]);

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.slug)));
  }

  function toggleOne(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function deleteOne(slug: string) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    startTransition(async () => {
      await bulkDeleteAction(collectionId, [slug]);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
    });
  }

  function applyBulk() {
    if (!bulkAction || selected.size === 0) return;
    const slugs = Array.from(selected);

    if (bulkAction === "delete") {
      const count = slugs.length;
      if (!window.confirm(`Delete ${count} item${count === 1 ? "" : "s"}? This cannot be undone.`)) {
        return;
      }
      startTransition(async () => {
        await bulkDeleteAction(collectionId, slugs);
        setSelected(new Set());
        setBulkAction("");
      });
      return;
    }

    const status = bulkAction === "publish" ? "published" : "draft";
    startTransition(async () => {
      await bulkSetStatusAction(collectionId, slugs, status);
      setSelected(new Set());
      setBulkAction("");
    });
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          disabled={pending}
          aria-label="Bulk actions"
          className="border-b border-hairline bg-transparent py-1.5 font-sans text-label text-ink outline-none focus:border-primary"
        >
          <option value="">Bulk actions</option>
          <option value="publish">Set to Published</option>
          <option value="draft">Set to Draft</option>
          {canDelete && <option value="delete">Delete</option>}
        </select>
        <button
          type="button"
          onClick={applyBulk}
          disabled={pending || !bulkAction || selected.size === 0}
          className="border border-hairline px-4 py-1.5 font-sans text-caption uppercase tracking-caps text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
        >
          Apply
        </button>
        {selected.size > 0 && (
          <span className="font-sans text-micro text-muted">{selected.size} selected</span>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse">
          <thead>
            <tr className="border-y border-hairline text-left">
              <th className="w-10 py-3 pr-2">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                  className="accent-[var(--color-primary-strong,#8a6d3b)]"
                />
              </th>
              <th className="py-3 pr-6 font-sans text-caption uppercase tracking-caps text-muted">
                {titleColumnLabel}
              </th>
              {columnLabels.map((c) => (
                <th
                  key={c.name}
                  className="py-3 pr-6 font-sans text-caption uppercase tracking-caps text-muted"
                >
                  {c.label}
                </th>
              ))}
              <th className="py-3 text-right font-sans text-caption uppercase tracking-caps text-muted">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((doc) => (
              <tr
                key={doc.slug}
                className="group border-b border-hairline transition-colors hover:bg-wash"
              >
                <td className="py-3.5 pr-2">
                  <input
                    type="checkbox"
                    checked={selected.has(doc.slug)}
                    onChange={() => toggleOne(doc.slug)}
                    aria-label={`Select ${doc.title}`}
                    className="accent-[var(--color-primary-strong,#8a6d3b)]"
                  />
                </td>
                <td className="py-3.5 pr-6">
                  <Link
                    href={`/admin/${collectionId}/${encodeURIComponent(doc.slug)}`}
                    className="font-sans text-copy text-ink transition-colors hover:text-primary-strong"
                  >
                    {doc.title}
                  </Link>
                  {doc.status === "draft" && (
                    <span className="ml-3 font-sans text-micro uppercase tracking-caps text-primary-strong">
                      draft
                    </span>
                  )}
                  <span className="mt-0.5 block font-sans text-micro text-muted">{doc.slug}</span>
                  <span className="mt-1 flex gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <Link
                      href={`/admin/${collectionId}/${encodeURIComponent(doc.slug)}`}
                      className="font-sans text-micro uppercase tracking-caps text-primary-strong hover:text-primary"
                    >
                      Edit
                    </Link>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => deleteOne(doc.slug)}
                        disabled={pending}
                        className="font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary-strong disabled:opacity-40"
                      >
                        Delete
                      </button>
                    )}
                  </span>
                </td>
                {doc.columns.map((c) => (
                  <td key={c.name} className="py-3.5 pr-6 font-sans text-label text-text-secondary">
                    {c.value}
                  </td>
                ))}
                <td className="py-3.5 text-right font-sans text-micro text-muted">
                  {new Date(doc.updatedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
