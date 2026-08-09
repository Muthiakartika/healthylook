// Formats an integer rupiah amount as "IDR 95.000" (dot-thousands, no
// decimals — Indonesian Rupiah isn't normally shown with cents).
//
// Hand-rolled instead of `Intl.NumberFormat`/`toLocaleString` on purpose:
// locale-aware formatting can render slightly differently between the
// server (where Next.js first renders this page) and the browser, which
// React treats as a hydration mismatch. A tiny manual regex avoids that
// class of bug entirely, at the cost of only handling the one format we
// actually need.
export function formatIDR(amount: number): string {
  const withThousands = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `IDR ${withThousands}`;
}
