import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/ui/StickyCTA";
import WhatsAppFloatingButton from "@/components/ui/WhatsAppFloatingButton";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  EMAIL,
  PHONE_E164,
  MAPS_HREF,
  SOCIAL_LINKS,
} from "@/lib/constants";
// next/font/google downloads and self-hosts the font at build time (no
// runtime request to Google Fonts, and no layout-shift flash of a fallback
// font). Each font is exposed as a CSS variable on <html> rather than a
// className directly on text, so that globals.css's `@theme inline` block
// can re-map it into a Tailwind utility (`font-sans`, `font-script`) that
// any component can use.
//
// `display: "swap"` matters more in the redesign than it did before: the
// hero headline is enormous script, so a blocked font would leave the
// strongest element on the page invisible during load.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// The brand's real script face, self-hosted from the clinic's own webfont
// (src/fonts/RetroSignature.woff2, taken from their live site). This used to
// be Google's Tangerine, chosen as a stand-in on the assumption the licensed
// face could not be carried over — the client asked for the real one.
//
// `next/font/local` is the right tool rather than a hand-written @font-face:
// it fingerprints and self-hosts the file, emits the preload, and exposes the
// family as a CSS variable exactly like next/font/google, so `--font-script`
// in globals.css keeps working unchanged.
const retroSignature = localFont({
  src: "../fonts/RetroSignature.woff2",
  variable: "--font-retro-signature",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  // The `%s` template means each page sets only its own title and gets the
  // brand suffix for free — matching the live site's title pattern, which
  // is an SEO-critical element the brief says to preserve.
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://healthylook-aesthetic.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  robots: { index: true, follow: true },
};

/**
 * Schema.org structured data for the clinic.
 *
 * The brief lists schema markup among the SEO-critical elements a redesign
 * must not damage. This is a `MedicalBusiness` node rather than a generic
 * `LocalBusiness` — it's the type that lets Google surface opening hours,
 * location, and the medical nature of the practice, and every value in it
 * is the clinic's own published business information. No claims, ratings,
 * or review counts are asserted here: fabricating an `aggregateRating` is
 * both a policy violation and exactly the invented-statistic the brief
 * rules out.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: "https://healthylook-aesthetic.com",
  email: EMAIL,
  telephone: PHONE_E164,
  hasMap: MAPS_HREF,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Raya Silungan, Lodtunduh",
    addressLocality: "Ubud",
    addressRegion: "Bali",
    addressCountry: "ID",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "10:00",
    closes: "18:00",
  },
  sameAs: SOCIAL_LINKS.map((social) => social.href),
};

// The root layout renders once for every route. Putting <Header>, <Footer>,
// the mobile <StickyCTA>, and the desktop <WhatsAppFloatingButton> here —
// instead of importing them into each page — means every new page under
// src/app/ gets the same global chrome automatically; no page file needs to
// remember to include them.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${retroSignature.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-background text-text">
        <script
          type="application/ld+json"
          // Next.js requires JSON-LD to be injected this way; the content is
          // a literal object defined above, never user input, so there's no
          // injection surface here.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Skip link — first thing in the tab order, visually hidden until
            focused. Required for keyboard users given how many nav links
            sit between the top of the page and the content. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-brand focus:bg-primary-strong focus:px-5 focus:py-3 focus:font-sans focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <Header />

        {/* flex-1 pushes the footer to the bottom of the viewport even when
            a page's content is shorter than the screen. No top padding
            here: the header is fixed and every page opens with a
            full-bleed hero that intentionally runs underneath it. Pages
            without a hero add their own top spacing. */}
        {/* tabIndex={-1} is what actually makes the skip link work: without
            it, following "#main" scrolls the page but leaves focus in the
            header, so the next Tab drops the user right back into the nav
            they just skipped. It's not keyboard-reachable itself — -1 only
            makes it programmatically focusable. */}
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        <Footer />
        <StickyCTA />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
