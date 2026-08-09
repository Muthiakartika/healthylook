// Sample testimonials for the homepage/location carousels.
//
// These are ORIGINAL placeholder quotes written for this rebuild — not the
// real client's real customer reviews. Real reviews involve identifiable
// third parties (names, personal accounts) that shouldn't be scraped from
// the live site and re-published without each reviewer's consent, even
// though the clinic itself is entitled to display reviews about its own
// business. Swap these for client-approved real testimonials before this
// site goes live; the `source` field ("Google", "Fresha", …) mirrors the
// review-platform badge style the client already uses.

export type Testimonial = {
  id: string;
  name: string;
  quote: string;
  source: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Amelia R.",
    quote:
      "Booked a Botox appointment while on holiday and it was the easiest, least stressful treatment I've had. The doctor talked me through every option before we started and never pushed for more than I asked for.",
    source: "Google",
  },
  {
    id: "t2",
    name: "Priya K.",
    quote:
      "The clinic itself is beautiful and so quiet — it barely feels like a medical visit. My skin booster results were subtle in the best way, exactly the 'well-rested' look I wanted.",
    source: "Fresha",
  },
  {
    id: "t3",
    name: "Sophie L.",
    quote:
      "What stood out was how honest the consultation was. I came in asking about filler and left with a simpler, cheaper recommendation that worked just as well.",
    source: "Google",
  },
  {
    id: "t4",
    name: "Hana W.",
    quote:
      "Comfortable chairs, good numbing cream, and a doctor who explained the whole HIFU process before starting. Would happily come back on my next trip to Bali.",
    source: "Fresha",
  },
];
