/**
 * A lightweight stand-in for Yoast's SEO panel — real checks on real
 * numbers (character counts against the ranges search engines actually
 * truncate at), not a fabricated "score". No readability algorithm: that
 * would need real analysis logic this project doesn't have, and a fake
 * percentage that looks like it analysed the prose but didn't would be
 * actively misleading.
 */
type Check = { label: string; status: "good" | "warning"; detail: string };

function checkLength(
  value: string,
  min: number,
  max: number,
  shortLabel: string,
  goodLabel: string,
  longLabel: string,
): Check {
  const length = value.trim().length;
  if (length === 0) {
    return { label: shortLabel, status: "warning", detail: "Nothing written yet." };
  }
  if (length < min) {
    return { label: shortLabel, status: "warning", detail: `${length} characters — aim for ${min}–${max}.` };
  }
  if (length > max) {
    return {
      label: longLabel,
      status: "warning",
      detail: `${length} characters — search engines may cut this off past ${max}.`,
    };
  }
  return { label: goodLabel, status: "good", detail: `${length} characters.` };
}

export default function SeoPanel({ title, description }: { title: string; description: string }) {
  const checks: Check[] = [
    checkLength(title, 30, 60, "Title is short", "Title length is good", "Title is long"),
    checkLength(
      description,
      70,
      160,
      "Meta description is short",
      "Meta description length is good",
      "Meta description is long",
    ),
  ];

  return (
    <ul className="flex flex-col gap-3">
      {checks.map((check) => (
        <li key={check.label} className="flex items-start gap-2.5">
          <span
            aria-hidden="true"
            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
              check.status === "good" ? "bg-[var(--color-admin-success)]" : "bg-[var(--color-admin-warning)]"
            }`}
          />
          <div>
            <p className="font-sans text-label text-ink">{check.label}</p>
            <p className="font-sans text-micro text-muted">{check.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
