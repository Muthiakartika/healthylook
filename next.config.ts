import type { NextConfig } from "next";

/**
 * No `images.remotePatterns` needed: every photo is served from
 * `public/images/`, copied from the client's own WordPress media library
 * rather than hotlinked. Hotlinking the live site would make this build
 * depend on the old site staying up, and would put load on their host.
 */
const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP second. The source files are mostly large JPEGs
    // (one is 4000×4000) and every one of them is re-encoded and resized
    // on demand, which is what keeps a photo-heavy redesign fast.
    formats: ["image/avif", "image/webp"],

    // Every `quality` value used anywhere in the app has to be declared
    // here. Next 15 only warns about undeclared ones — but it warns twice
    // per image, which buried the console in this photo-heavy build, and
    // from Next 16 an undeclared quality is a hard error rather than a
    // warning. Declaring them now fixes the noise and the future break.
    //   75 — Next's default, used by the logo and the partner marquee
    //   82 — the <Img> default, used by every in-page photograph
    //   85 — the two hero images, which are the largest things on screen
    qualities: [75, 82, 85],
  },

  /**
   * The earlier version of this build invented its own URL scheme
   * (/treatments/..., /about) before the live site's real structure had
   * been audited. The real paths are /ubud-bali/... and /our-doctor, and
   * the site now uses those.
   *
   * These redirects exist so nothing that linked to the interim scheme
   * breaks. They're permanent (308) because the interim URLs are not
   * coming back — which is also what tells search engines to transfer any
   * ranking signal to the real URL rather than treating both as
   * duplicates.
   */
  async redirects() {
    return [
      { source: "/about", destination: "/our-doctor", permanent: true },
      { source: "/treatments", destination: "/ubud-bali", permanent: true },
      { source: "/treatments/:path*", destination: "/ubud-bali/:path*", permanent: true },
      // The live site's own treatments hub also answers at /ubud-bali,
      // and its blog lives at /our-blog rather than /blog.
      { source: "/blog", destination: "/our-blog", permanent: true },
      { source: "/locations/ubud", destination: "/ubud-bali", permanent: true },
    ];
  },
};

export default nextConfig;
