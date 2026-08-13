import Img from "@/components/ui/Img";

/**
 * The thumbnail for a treatment card.
 *
 * ── Why this exists ──
 * The clinic has 30+ treatments and roughly 13 usable photographs. Any
 * "fall back to the category image" scheme therefore ends up printing the
 * same photo three or four times on a single page — which is what was
 * happening: the Facial Enhancement shot appeared in the sidebar and again
 * in a related card a screen below it.
 *
 * Repeating a photo reads as a bug. Repeating it while *pretending* it
 * depicts a different treatment is also mildly dishonest — that shot is
 * not a picture of Sculptra.
 *
 * So a treatment with no photograph of its own gets a deliberate
 * typographic tile instead: the brand's warm neutral, a hairline, and the
 * category name set as a small-caps label. It reads as an intentional part
 * of the design system rather than as a missing image, it never repeats
 * misleadingly, and the moment the clinic supplies a real photo the tile
 * is replaced automatically by passing `src`.
 */
export default function TreatmentThumb({
  src,
  name,
  categoryLabel,
  aspect = "landscape",
  rounded = "rounded-none",
  sizes = "(max-width: 640px) 100vw, 33vw",
}: {
  src?: string;
  name: string;
  categoryLabel?: string;
  aspect?: "landscape" | "portrait" | "square" | "wide";
  rounded?: string;
  sizes?: string;
}) {
  if (src) {
    return (
      <Img src={src} alt={name} aspect={aspect} rounded={rounded} sizes={sizes} />
    );
  }

  const aspectClass =
    aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "square"
        ? "aspect-square"
        : aspect === "wide"
          ? "aspect-[16/9]"
          : "aspect-[4/3]";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border-b border-hairline bg-wash ${aspectClass} ${rounded}`}
      // Decorative: the treatment name is always in the heading right
      // beside this tile, so announcing it again here is pure noise.
      aria-hidden="true"
    >
      <span className="eyebrow px-6 text-center text-primary/45">
        {categoryLabel ?? "Healthy Look"}
      </span>
    </div>
  );
}
