import { formatIDR } from "@/lib/format";
import type { PriceGroup } from "@/data/treatments";

/**
 * Renders the clinic's real price groups.
 *
 * Set as a typographic table rather than as pricing cards. Three-column
 * pricing cards imply tiers ("good / better / best") that this clinic
 * doesn't offer, and they'd make a doctor-led medical service look like a
 * subscription product. A quiet table is also what "transparent pricing"
 * actually looks like.
 *
 * `price: null` renders the live site's own wording — "By Consultation" —
 * rather than a zero or a blank cell. One row on the real price list is
 * genuinely quoted that way (Dermapen stretch marks), and showing
 * "IDR 0" there would be worse than showing nothing.
 */
export default function PriceTable({
  groups,
  tone = "light",
}: {
  groups: PriceGroup[];
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const rule = dark ? "border-white/12" : "border-hairline";
  const labelColor = dark ? "text-white/85" : "text-ink";
  // Prices and group titles both run small (14px and 12px), so on light
  // surfaces they take the deepest gold — -primary is only 3.7:1 on `wash`,
  // which is where this table most often sits.
  const priceColor = dark ? "text-gold-soft" : "text-primary-strong";
  const noteColor = dark ? "text-white/45" : "text-text-secondary";
  const titleColor = dark ? "text-gold-soft" : "text-primary-strong";

  return (
    <div className="flex flex-col gap-10">
      {groups.map((group, groupIndex) => (
        <div key={group.title ?? groupIndex}>
          {group.title && <h3 className={`eyebrow ${titleColor}`}>{group.title}</h3>}

          <dl className={`${group.title ? "mt-5" : ""} border-t ${rule}`}>
            {group.rows.map((row) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between gap-6 border-b ${rule} py-3.5`}
              >
                <dt className={`font-sans text-copy leading-snug ${labelColor}`}>
                  {row.label}
                </dt>
                <dd
                  className={`shrink-0 text-right font-sans text-sm tabular-nums ${priceColor}`}
                >
                  {row.price === null ? (
                    <span className={`text-label ${noteColor}`}>By Consultation</span>
                  ) : (
                    <>
                      {formatIDR(row.price)}
                      {row.unit && (
                        <span className={`ml-0.5 text-caption ${noteColor}`}>
                          {row.unit}
                        </span>
                      )}
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {group.note && (
            <p className={`mt-4 font-sans text-label leading-relaxed ${noteColor}`}>
              {group.note}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
