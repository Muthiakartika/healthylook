import type { SectionTable } from "@/data/treatmentSections";

/**
 * What each section surface looks like, in one place.
 *
 * ── WHY A TABLE AND NOT A TERNARY AT EACH SITE ─────────────────────────
 * A tinted section changes four things at once — its own background, its
 * heading colour, the prose colour, and the card chrome inside it — and a
 * dark one inverts all four. Spread across the markup as conditionals,
 * that is four chances to forget one, and forgetting the heading on the
 * brown surface means ink-on-brown, which is unreadable rather than merely
 * wrong.
 *
 * `plain` carries no padding at all: an untinted section should sit on the
 * page exactly as it did before any of this existed, not inside an
 * invisible box that shifts it.
 *
 * The four are the site's own tones, from SectionShell — not a new palette.
 */
export const SECTION_TONES = {
  plain: {
    shell: "",
    surface: "bg-paper",
    heading: "text-ink",
    prose: "",
    card: "border-hairline bg-background",
    point: "text-text-secondary",
    icon: "text-primary",
  },
  wash: {
    shell: "bg-wash px-7 py-9 sm:px-9",
    surface: "bg-wash",
    heading: "text-ink",
    prose: "",
    card: "border-hairline bg-background",
    point: "text-text-secondary",
    icon: "text-primary",
  },
  blush: {
    shell: "bg-blush px-7 py-9 sm:px-9",
    surface: "bg-blush",
    heading: "text-ink",
    prose: "",
    card: "border-hairline bg-background",
    point: "text-text-secondary",
    icon: "text-primary",
  },
  brown: {
    shell: "bg-ink-brown px-7 py-9 text-white sm:px-9",
    surface: "bg-ink-brown",
    heading: "text-white",
    // Portable Text and plain paragraphs both render <p>, so one selector
    // covers the pair rather than each branch carrying its own colour.
    prose: "[&_p]:text-white/75 [&_li]:text-white/75 [&_a]:text-gold-soft",
    card: "border-white/15 bg-white/5",
    point: "text-white/75",
    icon: "text-gold-soft",
  },
} as const;

/**
 * A comparison table inside a treatment section.
 *
 * ── THE SCROLLER IS THE WHOLE DESIGN PROBLEM ───────────────────────────
 * The clinic's own comparison is four columns of prose cells, and there is
 * no width at which that fits a 320px phone. The two honest options are to
 * reflow each row into a stacked card, or to let the table keep its shape
 * and scroll sideways inside its own box. This does the second: a stacked
 * version silently destroys the one thing a comparison table is for, which
 * is reading across a row. `overflow-x-auto` keeps the comparison intact
 * and keeps the scrolling INSIDE the figure — the page body must never
 * scroll horizontally.
 *
 * Columns carry a hairline rule between them, asked for directly by the
 * clinic. It is the same hairline every other rule on the site uses, and
 * it can only ever appear inside a <table> — so no page that does not have
 * one looks any different.
 *
 * The first column is sticky so the attribute being compared stays on
 * screen while the devices scroll past it. Without that, a reader three
 * columns deep no longer knows whether they are looking at comfort level
 * or cost.
 */
export default function SectionTableFigure({
  table,
  tone,
  className = "",
}: {
  table: SectionTable;
  tone: (typeof SECTION_TONES)[keyof typeof SECTION_TONES];
  className?: string;
}) {
  if (!table.columns.length || !table.rows.length) return null;
  const labelFirst = table.labelFirstColumn ?? true;
  const headingClass = `font-sans text-caption uppercase leading-snug tracking-caps ${
    tone === SECTION_TONES.brown ? "text-gold-soft" : "text-primary-strong"
  }`;
  return (
    <figure className={className}>
      {/* ── PHONE: STOP BEING A TABLE ────────────────────────────────────
          A four-column comparison cannot be made to fit 360px, and the
          clinic had already objected once to content running off the right
          edge, so below `sm` the honest answer is to reflow rather than to
          be a table the reader has to drag sideways.

          Which shape it takes is read from `labelFirstColumn` — the flag
          that already records what kind of table this is. No new setting,
          and nothing for an editor to choose wrongly:

          • label + values, a real comparison → one block per ROW, so all
            three devices stay together under the attribute being read.
            One block per DEVICE would look tidier and destroy the point:
            answering "which is more comfortable" would mean scrolling
            between three separate cards.

          • peer columns, the can/cannot pairing → one list per COLUMN.
            Nothing is lost, because nothing in that table relates across a
            row — "Enhances jawline definition" has no connection to the
            "cannot" item printed beside it. */}
      <div className="sm:hidden">
        {labelFirst ? (
          <dl className="flex flex-col gap-6 border-t border-hairline pt-5">
            {table.rows.map((row, rowIndex) => (
              <div key={row[0] || rowIndex}>
                <dt className={headingClass}>{row[0]}</dt>
                <dd className="mt-2.5 flex flex-col gap-2.5">
                  {table.columns.slice(1).map((column, columnIndex) => {
                    const cell = row[columnIndex + 1];
                    if (!cell) return null;
                    return (
                      <div key={column || columnIndex}>
                        {/* The column name gets its own line rather than a
                            fixed-width gutter: these read "Thermage
                            (single-frequency RF)", which no sensible gutter
                            width survives. */}
                        <span
                          className={`block font-sans text-label opacity-70 ${tone.point}`}
                        >
                          {column}
                        </span>
                        <span className={`font-sans text-copy leading-snug ${tone.point}`}>
                          {cell}
                        </span>
                      </div>
                    );
                  })}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="flex flex-col gap-7 border-t border-hairline pt-5">
            {table.columns.map((column, columnIndex) => {
              const cells = table.rows
                .map((row) => row[columnIndex])
                .filter((cell): cell is string => Boolean(cell));
              if (!cells.length) return null;
              return (
                <div key={column || columnIndex}>
                  <h4 className={headingClass}>{column}</h4>
                  <ul className="mt-3 flex flex-col gap-2">
                    {cells.map((cell) => (
                      <li
                        key={cell}
                        className={`flex gap-2.5 font-sans text-copy leading-snug ${tone.point}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-2 h-1 w-1 shrink-0 rounded-full bg-current ${tone.icon}`}
                        />
                        {cell}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── `sm` AND UP: THE REAL TABLE ──────────────────────────────────
          Still scrolls inside its own box rather than reflowing, because at
          this width reading across a row is both possible and the whole
          point of the thing. */}
      <div className="hidden overflow-x-auto border-t border-hairline sm:block">
        <table className="w-full min-w-[34rem] border-collapse text-left">
          <thead>
            <tr>
              {table.columns.map((column, index) => (
                <th
                  key={column || index}
                  scope="col"
                  className={`border-b border-r border-hairline px-4 py-3.5 align-bottom ${headingClass} first:pl-0 last:border-r-0 last:pr-0 ${
                    index === 0 && labelFirst ? `sticky left-0 z-10 ${tone.surface}` : ""
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={row[0] || rowIndex}>
                {table.columns.map((_, columnIndex) => {
                  const cell = row[columnIndex] ?? "";
                  // A row-labelling first cell becomes a row header, which
                  // is what lets a screen reader announce "Comfort level"
                  // before reading the value the reader has landed on.
                  // Where the columns are peers it stays an ordinary cell —
                  // see `labelFirstColumn`.
                  const isLabel = columnIndex === 0 && labelFirst;
                  const Cell = isLabel ? "th" : "td";
                  return (
                    <Cell
                      key={columnIndex}
                      {...(isLabel ? { scope: "row" as const } : {})}
                      className={`border-b border-r border-hairline px-4 py-3.5 align-top font-sans text-copy leading-body first:pl-0 last:border-r-0 last:pr-0 ${
                        isLabel
                          ? `sticky left-0 z-10 font-medium ${tone.surface} ${tone.heading}`
                          : tone.point
                      }`}
                    >
                      {cell}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption && (
        <figcaption className="mt-3 font-sans text-caption leading-relaxed text-muted">
          {table.caption}
        </figcaption>
      )}
    </figure>
  );
}
