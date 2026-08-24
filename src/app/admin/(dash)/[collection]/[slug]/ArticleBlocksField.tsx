"use client";

import { useMemo, useState } from "react";

/**
 * The article body editor.
 *
 * ── WHAT IT REPLACES, AND WHY THAT WAS NOT GOOD ENOUGH ────────────────
 * This field was a raw JSON textarea. That was defensible as a first cut —
 * it is honest about the shape and cannot silently drop a key — but the
 * real articles hold 240 paragraphs and 213 headings, and asking someone
 * to fix a typo by finding the right object in several hundred lines of
 * JSON is not editing, it is programming with extra steps. One missing
 * comma also loses the whole body rather than one block.
 *
 * ── HOW IT STAYS COMPATIBLE ───────────────────────────────────────────
 * The value still leaves as JSON, in a hidden input, in exactly the shape
 * `ArticleBlock[]` describes. Nothing in the save path changed: the server
 * still parses and validates the same string it always did. This is a
 * different way of producing that string, not a different format.
 *
 * ── WHY THE JSON VIEW SURVIVES ────────────────────────────────────────
 * Kept as a toggle, for three things a form cannot do: pasting a body in
 * from elsewhere, repairing a block whose shape predates this editor, and
 * seeing exactly what will be saved. Switching back parses it, so a broken
 * edit there is caught before it reaches the form.
 */

type Heading = { type: "heading"; level: 2 | 3; text: string };
type Paragraph = { type: "paragraph"; text: string };
type ListBlock = { type: "list"; items: string[] };
type TableBlock = { type: "table"; head: string[]; rows: string[][] };
type FaqBlock = { type: "faq"; items: { question: string; answer: string }[] };
export type ArticleBlock = Heading | Paragraph | ListBlock | TableBlock | FaqBlock;

type Keyed = { key: string; block: ArticleBlock };

const BLOCK_LABEL: Record<ArticleBlock["type"], string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  list: "Bullet list",
  table: "Table",
  faq: "Questions & answers",
};

function blank(type: ArticleBlock["type"]): ArticleBlock {
  switch (type) {
    case "heading":
      return { type: "heading", level: 2, text: "" };
    case "list":
      return { type: "list", items: [""] };
    case "table":
      return { type: "table", head: ["", ""], rows: [["", ""]] };
    case "faq":
      return { type: "faq", items: [{ question: "", answer: "" }] };
    default:
      return { type: "paragraph", text: "" };
  }
}

/* Keys are generated per block and survive reordering. Using the array
   index would make React reuse the wrong DOM node when a block moves,
   which shows up as text jumping between fields. */
let counter = 0;
const nextKey = () => `b${++counter}`;

const input =
  "w-full border-b border-hairline bg-transparent py-2 font-sans text-copy text-ink outline-none transition-colors focus:border-primary";
const area =
  "w-full resize-y border border-hairline bg-paper p-3 font-sans text-copy leading-relaxed text-ink outline-none transition-colors focus:border-primary";
const tiny =
  "font-sans text-micro uppercase tracking-caps text-muted transition-colors hover:text-primary disabled:opacity-40";

function BlockBody({
  block,
  onChange,
}: {
  block: ArticleBlock;
  onChange: (next: ArticleBlock) => void;
}) {
  if (block.type === "heading") {
    return (
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex items-center gap-2">
          <span className="font-sans text-micro uppercase tracking-caps text-muted">
            Level
          </span>
          <select
            value={block.level}
            onChange={(e) =>
              onChange({ ...block, level: Number(e.target.value) === 3 ? 3 : 2 })
            }
            className="border-b border-hairline bg-transparent py-1 font-sans text-label text-ink outline-none focus:border-primary"
          >
            <option value={2}>Section (H2)</option>
            <option value={3}>Sub-section (H3)</option>
          </select>
        </label>
        <input
          value={block.text}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder="Heading text"
          className={`${input} flex-1 min-w-48`}
        />
      </div>
    );
  }

  if (block.type === "paragraph") {
    return (
      <textarea
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        rows={Math.min(14, Math.max(3, Math.ceil(block.text.length / 90) + 1))}
        placeholder="Paragraph text"
        className={area}
      />
    );
  }

  if (block.type === "list") {
    return (
      <div className="flex flex-col gap-2">
        {block.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span aria-hidden="true" className="text-muted">
              ·
            </span>
            <input
              value={item}
              onChange={(e) => {
                const items = [...block.items];
                items[i] = e.target.value;
                onChange({ ...block, items });
              }}
              placeholder="List item"
              className={input}
            />
            <button
              type="button"
              onClick={() =>
                onChange({ ...block, items: block.items.filter((_, j) => j !== i) })
              }
              disabled={block.items.length === 1}
              className={tiny}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          className={`${tiny} self-start pt-1`}
        >
          + Add item
        </button>
      </div>
    );
  }

  if (block.type === "faq") {
    return (
      <div className="flex flex-col gap-5">
        {block.items.map((item, i) => (
          <div key={i} className="border-l-2 border-hairline pl-4">
            <input
              value={item.question}
              onChange={(e) => {
                const items = [...block.items];
                items[i] = { ...item, question: e.target.value };
                onChange({ ...block, items });
              }}
              placeholder="Question"
              className={input}
            />
            <textarea
              value={item.answer}
              onChange={(e) => {
                const items = [...block.items];
                items[i] = { ...item, answer: e.target.value };
                onChange({ ...block, items });
              }}
              rows={3}
              placeholder="Answer"
              className={`${area} mt-2`}
            />
            <button
              type="button"
              onClick={() =>
                onChange({ ...block, items: block.items.filter((_, j) => j !== i) })
              }
              disabled={block.items.length === 1}
              className={`${tiny} mt-2`}
            >
              Remove question
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({ ...block, items: [...block.items, { question: "", answer: "" }] })
          }
          className={`${tiny} self-start`}
        >
          + Add question
        </button>
      </div>
    );
  }

  // Table. Adding or removing a column has to touch the header AND every
  // row together — a row with a different width than the header renders
  // as a broken table rather than a missing cell.
  const setColumns = (count: number) => {
    const fit = (row: string[]) =>
      Array.from({ length: count }, (_, i) => row[i] ?? "");
    onChange({ ...block, head: fit(block.head), rows: block.rows.map(fit) });
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse">
          <thead>
            <tr>
              {block.head.map((cell, c) => (
                <th key={c} className="border border-hairline p-1 align-top">
                  <input
                    value={cell}
                    onChange={(e) => {
                      const head = [...block.head];
                      head[c] = e.target.value;
                      onChange({ ...block, head });
                    }}
                    placeholder={`Column ${c + 1}`}
                    className="w-full bg-transparent p-1 font-sans text-label font-medium text-ink outline-none"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border border-hairline p-1 align-top">
                    <input
                      value={cell}
                      onChange={(e) => {
                        const rows = block.rows.map((x) => [...x]);
                        rows[r][c] = e.target.value;
                        onChange({ ...block, rows });
                      }}
                      className="w-full bg-transparent p-1 font-sans text-label text-ink outline-none"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap gap-4">
        <button type="button" onClick={() => setColumns(block.head.length + 1)} className={tiny}>
          + Column
        </button>
        <button
          type="button"
          onClick={() => setColumns(block.head.length - 1)}
          disabled={block.head.length <= 1}
          className={tiny}
        >
          − Column
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({ ...block, rows: [...block.rows, block.head.map(() => "")] })
          }
          className={tiny}
        >
          + Row
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...block, rows: block.rows.slice(0, -1) })}
          disabled={block.rows.length <= 1}
          className={tiny}
        >
          − Row
        </button>
      </div>
    </div>
  );
}

export default function ArticleBlocksField({
  name,
  label,
  initial,
}: {
  name: string;
  label: string;
  initial: unknown;
}) {
  const [blocks, setBlocks] = useState<Keyed[]>(() => {
    const source = Array.isArray(initial) ? (initial as ArticleBlock[]) : [];
    return source.map((block) => ({ key: nextKey(), block }));
  });
  const [raw, setRaw] = useState(false);
  const [rawText, setRawText] = useState("");
  const [rawError, setRawError] = useState<string | null>(null);

  const serialised = useMemo(
    () => JSON.stringify(blocks.map((b) => b.block)),
    [blocks],
  );

  const update = (index: number, next: ArticleBlock) =>
    setBlocks((prev) =>
      prev.map((item, i) => (i === index ? { ...item, block: next } : item)),
    );

  const move = (index: number, by: number) =>
    setBlocks((prev) => {
      const to = index + by;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });

  const add = (type: ArticleBlock["type"], at: number) =>
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(at, 0, { key: nextKey(), block: blank(type) });
      return next;
    });

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <span className="font-sans text-caption uppercase tracking-caps text-muted">
          {label}
        </span>
        <button
          type="button"
          onClick={() => {
            if (!raw) {
              setRawText(JSON.stringify(blocks.map((b) => b.block), null, 2));
              setRawError(null);
              setRaw(true);
              return;
            }
            // Leaving the JSON view parses it, so a broken edit is caught
            // here rather than on save.
            try {
              const parsed = JSON.parse(rawText);
              if (!Array.isArray(parsed)) throw new Error("The body must be a list of blocks.");
              setBlocks(parsed.map((block: ArticleBlock) => ({ key: nextKey(), block })));
              setRawError(null);
              setRaw(false);
            } catch (e) {
              setRawError(e instanceof Error ? e.message : "That is not valid JSON.");
            }
          }}
          className={tiny}
        >
          {raw ? "Back to the editor" : "Edit as JSON"}
        </button>
      </div>

      {/* The value the form actually submits. Always present, in both
          views, so switching view can never lose the body. */}
      <input type="hidden" name={name} value={raw ? rawText : serialised} />

      {raw ? (
        <>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            spellCheck={false}
            rows={24}
            className="mt-3 w-full resize-y border border-hairline bg-paper p-3 font-mono text-[13px] leading-relaxed text-ink outline-none focus:border-primary"
          />
          {rawError && (
            <p role="alert" className="mt-2 font-sans text-micro text-primary-strong">
              {rawError}
            </p>
          )}
        </>
      ) : (
        <>
          {blocks.length === 0 && (
            <p className="mt-4 font-sans text-label text-text-secondary">
              This article has no body yet. Add the first block below.
            </p>
          )}

          <ol className="mt-4 flex flex-col gap-4">
            {blocks.map((item, index) => (
              <li key={item.key} className="border border-hairline bg-paper">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-4 py-2.5">
                  <span className="font-sans text-micro uppercase tracking-caps text-primary-strong">
                    {index + 1}. {BLOCK_LABEL[item.block.type]}
                  </span>
                  <span className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className={tiny}
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === blocks.length - 1}
                      className={tiny}
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setBlocks((prev) => prev.filter((_, i) => i !== index))
                      }
                      className={tiny}
                    >
                      Delete
                    </button>
                  </span>
                </div>

                <div className="p-4">
                  <BlockBody
                    block={item.block}
                    onChange={(next) => update(index, next)}
                  />
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-4">
            <span className="font-sans text-micro uppercase tracking-caps text-muted">
              Add
            </span>
            {(Object.keys(BLOCK_LABEL) as ArticleBlock["type"][]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => add(type, blocks.length)}
                className={tiny}
              >
                + {BLOCK_LABEL[type]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
