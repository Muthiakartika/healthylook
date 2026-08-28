"use client";

import { useMemo, useState } from "react";
import RichTextBlockField from "./RichTextBlockField";
import { normalizeArticleBlocks, type ArticleBlock, type NormalizedBlock, type RichTextBlock } from "@/data/articles";

/**
 * The article body editor.
 *
 * ── WHAT IT REPLACES, AND WHY THAT WAS NOT GOOD ENOUGH ────────────────
 * This field was a raw JSON textarea, then a structured block editor with
 * a plain `<textarea>` per paragraph and a `<select>`+`<input>` per
 * heading. Both were honest about the shape but neither was what an
 * editor sees is what gets published — no live bold/italic, no visible
 * heading size, links typed as `[label](href)` text rather than applied
 * to a selection. Headings/paragraphs/bullet lists are now one continuous
 * rich-text canvas (RichTextBlockField.tsx) with a selection-triggered
 * formatting toolbar, Notion/Word-style. Table and FAQ blocks keep their
 * own structured editing below, completely unchanged — a table's rows and
 * an FAQ's question/answer pairs are still typed into dedicated fields,
 * not typed as flowing prose.
 *
 * ── HOW IT STAYS COMPATIBLE ───────────────────────────────────────────
 * The value still leaves as JSON, in a hidden input. Nothing in the save
 * path changed: the server still parses and validates the same string it
 * always did. `normalizeArticleBlocks` (src/data/articles.ts) upgrades
 * whatever shape `initial` arrives in — old flat heading/paragraph/list
 * blocks, or blocks already in the current richtext/table/faq shape — so
 * every article, migrated or brand new, opens the same way.
 *
 * ── WHY THE JSON VIEW SURVIVES ────────────────────────────────────────
 * Kept as a toggle, for three things a form cannot do: pasting a body in
 * from elsewhere, repairing a block whose shape predates this editor, and
 * seeing exactly what will be saved. Switching back parses and normalizes
 * it, so a broken or legacy-shaped edit there is caught before it reaches
 * the form.
 */

type Keyed = { key: string; block: NormalizedBlock };

const BLOCK_LABEL: Record<NormalizedBlock["type"], string> = {
  richtext: "Text",
  table: "Table",
  faq: "Questions & answers",
};

/** The only two types the "+" inserter offers — rich text isn't something
 *  you insert, it's what you're already typing into or splitting. */
const INSERTABLE_TYPES: Array<"table" | "faq"> = ["table", "faq"];

function blankRichText(): RichTextBlock {
  return { type: "richtext", content: { type: "doc", content: [{ type: "paragraph" }] } };
}

function blank(type: "table" | "faq"): NormalizedBlock {
  return type === "table"
    ? { type: "table", head: ["", ""], rows: [["", ""]] }
    : { type: "faq", items: [{ question: "", answer: "" }] };
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
  onSplit,
}: {
  block: NormalizedBlock;
  onChange: (next: NormalizedBlock) => void;
  onSplit: (type: "table" | "faq", before: RichTextBlock | null, after: RichTextBlock | null) => void;
}) {
  if (block.type === "richtext") {
    return <RichTextBlockField block={block} onChange={onChange} onSplit={onSplit} />;
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

/**
 * The "+" between blocks — click it to reveal Table/Q&A right at that
 * position, WordPress-style. Rich text itself isn't inserted this way;
 * splitting an existing text run is done from inside the canvas (its own
 * "Split here and insert" controls), since that needs to know the cursor
 * position, which this inserter — sitting between two already-separate
 * blocks — never has to care about.
 */
function Inserter({
  open,
  onToggle,
  onAdd,
}: {
  open: boolean;
  onToggle: () => void;
  onAdd: (type: "table" | "faq") => void;
}) {
  return (
    <div className="relative flex items-center justify-center py-2">
      <div className="absolute inset-x-0 top-1/2 h-px bg-hairline" aria-hidden="true" />
      <button
        type="button"
        onClick={onToggle}
        aria-label="Add block here"
        aria-expanded={open}
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border font-sans leading-none transition-colors ${
          open
            ? "border-primary bg-primary text-white"
            : "border-hairline bg-paper text-muted hover:border-primary hover:text-primary"
        }`}
      >
        +
      </button>

      {open && (
        <div className="absolute top-full z-20 mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 border border-hairline bg-paper p-3 shadow-panel">
          {INSERTABLE_TYPES.map((type) => (
            <button key={type} type="button" onClick={() => onAdd(type)} className={tiny}>
              {BLOCK_LABEL[type]}
            </button>
          ))}
        </div>
      )}
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
    const source = Array.isArray(initial)
      ? normalizeArticleBlocks(initial as (ArticleBlock | NormalizedBlock)[])
      : [];
    // A brand-new article opens with a canvas already there to type into,
    // rather than an empty state screen — Notion/Word open on a blank
    // page, not a "no content yet" message.
    const withDefault = source.length > 0 ? source : [blankRichText()];
    return withDefault.map((block) => ({ key: nextKey(), block }));
  });
  const [raw, setRaw] = useState(false);
  const [rawText, setRawText] = useState("");
  const [rawError, setRawError] = useState<string | null>(null);
  const [openInserter, setOpenInserter] = useState<number | null>(null);

  const serialised = useMemo(
    () => JSON.stringify(blocks.map((b) => b.block)),
    [blocks],
  );

  const update = (index: number, next: NormalizedBlock) =>
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

  const add = (type: "table" | "faq", at: number) => {
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(at, 0, { key: nextKey(), block: blank(type) });
      return next;
    });
    setOpenInserter(null);
  };

  /** Replaces one richtext block with up to three: whatever text came
   *  before the cursor, the new Table/FAQ, and whatever came after —
   *  either half is omitted if the split landed at the very start/end. */
  const split = (
    index: number,
    type: "table" | "faq",
    before: RichTextBlock | null,
    after: RichTextBlock | null,
  ) => {
    setBlocks((prev) => {
      const replacement: Keyed[] = [];
      if (before) replacement.push({ key: nextKey(), block: before });
      replacement.push({ key: nextKey(), block: blank(type) });
      if (after) replacement.push({ key: nextKey(), block: after });
      const next = [...prev];
      next.splice(index, 1, ...replacement);
      return next;
    });
  };

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
            // Leaving the JSON view parses and normalizes it, so a broken
            // or legacy-shaped edit is caught here rather than on save.
            try {
              const parsed = JSON.parse(rawText);
              if (!Array.isArray(parsed)) throw new Error("The body must be a list of blocks.");
              const normalized = normalizeArticleBlocks(parsed);
              setBlocks(normalized.map((block) => ({ key: nextKey(), block })));
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

          <div className="mt-2 flex flex-col">
            <Inserter
              open={openInserter === 0}
              onToggle={() => setOpenInserter(openInserter === 0 ? null : 0)}
              onAdd={(type) => add(type, 0)}
            />

            {blocks.map((item, index) => (
              <div key={item.key}>
                <div className="border border-hairline bg-paper">
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
                      onSplit={(type, before, after) => split(index, type, before, after)}
                    />
                  </div>
                </div>

                <Inserter
                  open={openInserter === index + 1}
                  onToggle={() =>
                    setOpenInserter(openInserter === index + 1 ? null : index + 1)
                  }
                  onAdd={(type) => add(type, index + 1)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
