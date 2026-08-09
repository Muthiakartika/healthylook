// The blog index, exactly as it appears on healthylook-aesthetic.com/our-blog.
//
// ── WHY SOME POSTS LINK OFF-SITE ───────────────────────────────────────
// Seven of the ten posts on the live blog are articles *about a
// treatment*, and their real URLs are the treatment pages themselves —
// so those resolve to pages this build already has, in full.
//
// The remaining three are standalone long-form medical articles. They are
// deliberately NOT reproduced here. Their bodies live inside collapsible
// components on the live site that can't be extracted cleanly, and a
// partial extraction came back with headings whose content was missing —
// on articles that quote Botox dosages ("10–20 units"), brow-drop risk,
// and per-unit pricing. Publishing a truncated or paraphrased version of
// that is exactly the invented-medical-claim the brief prohibits, and it
// would be worse than not publishing at all.
//
// So they stay listed (the content isn't lost from the site's structure)
// and point at the clinic's existing article until someone migrates the
// full text with a doctor's sign-off. `external: true` drives that.

export type BlogPost = {
  title: string;
  href: string;
  /** True when the destination is still the clinic's current site. */
  external?: boolean;
  /** Which treatment this article is about, where it maps to one. */
  relatedTreatment?: string;
};

export const blogPosts: BlogPost[] = [
  {
    title: "Lysiwave - Fat & Cellulite Treatment in Bali",
    href: "/ubud-bali/fat-cellulite",
    relatedTreatment: "Lysiwave - Fat & Cellulite Treatment",
  },
  {
    title: "Collagen Stimulator in Bali",
    href: "/ubud-bali/collagen-stimulator",
    relatedTreatment: "Collagen Stimulator",
  },
  { title: "Sculptra in Bali", href: "/ubud-bali/sculptra", relatedTreatment: "Sculptra" },
  {
    title: "Autologues Micrograft Hair Restoration",
    href: "/ubud-bali/autologues-micrograft-hair-restoration",
    relatedTreatment: "Autologues Micrograft Hair Restoration",
  },
  { title: "Best Botox in Ubud Bali", href: "/ubud-bali/botox", relatedTreatment: "Botox" },
  {
    title: "Juvelook in Ubud Bali",
    href: "/ubud-bali/juvelook",
    relatedTreatment: "Juvelook Collagen Stimulator",
  },
  {
    title: "Advanced Body HIFU in Bali",
    href: "/ubud-bali/hifu/body",
    relatedTreatment: "Body HIFU",
  },
  {
    title: "Skin Clinic Bali",
    href: "https://healthylook-aesthetic.com/skin-clinic-bali/",
    external: true,
  },
  {
    title: "Nucleofill vs Rejuran",
    href: "https://healthylook-aesthetic.com/nucleofill-vs-rejuran/",
    external: true,
  },
  {
    title: "How Many Units of Botox for Forehead?",
    href: "https://healthylook-aesthetic.com/how-many-units-of-botox-for-forehead/",
    external: true,
  },
];
