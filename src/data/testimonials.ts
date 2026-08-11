// Patient reviews, and the per-treatment mapping that decides which ones
// appear on which page.
//
// ── SOURCE OF TRUTH ────────────────────────────────────────────────────
// Every quote, name and platform below was read from the clinic's own live
// site at healthylook-aesthetic.com — the same reviews the clinic already
// publishes about its own business, carried across to its rebuilt site.
// Nothing here is written, paraphrased or invented for the rebuild.
//
// An earlier version of this file carried four ORIGINAL placeholder quotes
// on the reasoning that reviews name identifiable third parties. That
// caution applies to scraping somebody else's reviews; it does not apply
// to migrating the client's own published page content onto the client's
// own replacement site. The placeholders are gone.
//
// ── WHAT THE LIVE SITE DOES ────────────────────────────────────────────
// The live site does NOT run one shared review carousel. Each treatment
// page carries reviews that name that treatment: the Botox page runs
// Angela / Cansu / Danica, all of whom mention Botox; the HIFU page runs
// four HIFU reviews; Microneedling runs three Dermapen reviews. The
// homepage runs a broader six that cover the clinic as a whole. That
// mapping is reproduced verbatim in TESTIMONIALS_BY_TREATMENT below.
//
// ── TWO PLACES THIS DELIBERATELY IMPROVES ON THE LIVE SITE ─────────────
// 1. Roughly half the live treatment pages (profhilo, skin-booster, prp,
//    facial, salmon-dna, exosome, ipl, iv-drip, the hair treatments …)
//    have no review section at all. Rather than leave those pages without
//    social proof, they fall back to GENERAL_TESTIMONIAL_IDS — real
//    clinic-wide reviews, not treatment claims the reviewer never made.
// 2. Where the same review appears on several live pages with slightly
//    different truncation (Alana's HIFU review, Zhanna's), it is stored
//    once, in its fullest published form.
//
// ⚠ RATINGS: the live site prints the quote and the platform, never a star
// count. The 5★ shown in the UI is inferred from these being the reviews
// the clinic itself selected to feature, several of which say "5 stars" in
// their own text. It is not read from a Google/Fresha API. Verify against
// each platform before launch, or drop the stars from Testimonials.tsx.

export type Testimonial = {
  id: string;
  /** As published by the reviewer on the platform. */
  name: string;
  quote: string;
  /** Review platform badge — "Google" or "Fresha". */
  source: string;
};

export const testimonials: Testimonial[] = [
  // ── Clinic-wide (the live homepage carousel) ─────────────────────────
  {
    id: "michelle",
    name: "Michelle",
    quote:
      "Had a great visit from start to finish. Have gotten Botox and fillers in the U.S. before but this experience was by far the best I have ever had. First and foremost they picked me up and dropped me off at my villa free of charge! I knew I wanted Botox but also spoke with Dr. Sienatra regarding where I needed fillers. Dr. Sienatra was extremely knowledgeable and very honest about what I needed and she provided me pricing on the spot. Numbing cream on my entire face and lips to avoid any pain as well as ice on the area right before the injection, completely painless! Results look amazing!",
    source: "Fresha",
  },
  {
    id: "alina",
    name: "Alina",
    quote:
      "I love the idea of an aesthetic clinic inside a 5-star resort. You got to chill n enjoy the psyche refresh and get a makeover all at the same time! The staffs were all very efficient and accommodating. The doctor was very skilled, she recommended treatments I have been on the fence about getting but was too nervous to try, but finally braved myself. I'm so glad I did, because the results are glowing ❤️❤️",
    source: "Google",
  },
  {
    id: "noura",
    name: "Noura El-Imam",
    quote:
      "I had my second filler experience with Dr Irene and I can't recommend her highly enough! I have to highlight that I also felt almost zero to 5% pain with all the needles on my face. This is exactly why I paused on going to another clinic until Dr Irene opened up her own. I'm glad I waited. I'm proud of her for opening up her own clinic at a beautiful location that feels so lovely. If you wish to dial back the years on your skin and give it a shot of life again, I highly recommend listening to Dr Irene's advice and going ahead with what she suggests. It's not a one size fits all. She never upsells.",
    source: "Google",
  },
  {
    id: "zhanna",
    name: "Zhanna Mahlysh",
    quote:
      "I've been in clinic recently, I love dr. Irene, she did magic, no bruises after Botox and lip fillers looking so natural all I've asked for, will be back ❤️",
    source: "Google",
  },
  {
    id: "nadine",
    name: "Nadine",
    quote:
      "I recieved a red carpet facial - as well as two BIOREPEEL (chemical peel) & IPL treatments over a 2 month period & The results were incredible! My pigmentation / sun damage reduced dramatically, fine lines reduced so much also and my skin has never looked so good! People keep commenting on how good my skin looks. The team at healthy look aesthetic are professional & amazing! The clinic is in a beautiful tranquil resort just out side of ubud - surrounded by trees and green so it is all very relaxing! Highly recommend healthy look aesthetic!! 5 stars ⭐️⭐️⭐️⭐️⭐️",
    source: "Google",
  },

  // ── Botox ────────────────────────────────────────────────────────────
  {
    id: "angela",
    name: "Angela",
    quote:
      "Dr. Irene is amazing! It's refreshing to meet a skilled Dr. injector who looks at your movement and face shape and makes recommendations based on that, not just trying to sell more botox units. Thank you for such a lovely and positive experience - I will be back!",
    source: "Fresha",
  },
  {
    id: "cansu",
    name: "Cansu Özal",
    quote:
      "One of the most professional skin aesthetic clinics I have ever seen. I had youth vaccination, red carpet facial and botox. They did a great job. Later, even after I returned to my country, they regularly followed up on how I was. I would definitely recommend it without hesitation.",
    source: "Google",
  },
  {
    id: "danica",
    name: "Danica",
    quote:
      "I am 52 and this was my first time for getting Botox! So naturally I wanted to feel safe and secure in my decision to have it at Healthy Look Aesthetic. Once I arrived and was greeted by the staff I started to relax. Then once I had the consultation with the dr I felt compost ease. The procedure went very well. I have experienced very few side effects. It's only the second day so best results can't be seen yet but I already feel that I look more refreshed and better than before 😊",
    source: "Fresha",
  },

  // ── Korean Botox ─────────────────────────────────────────────────────
  {
    id: "olivia",
    name: "Olivia",
    quote:
      "I am super happy with my botox result with Dr. Irene. I can't wait to try the other services they offer. I appreciate people who love their job and not just do it for money. Dr. Irene didn't force the treatments, she even recommended the lower dose and said putting less is better than putting too much, but it ended up I didn't need any touch-ups. I love the result as I still can move my face and look natural.",
    source: "Google",
  },
  {
    id: "suellen",
    name: "Suellen Hunter",
    quote:
      "Fabulous place to get Botox! Dr Irene and her team are really professional and caring. I'm super happy with the results and it was nice and quick. I will definitely be back ☺️",
    source: "Google",
  },
  {
    id: "dilara",
    name: "Dilara Sonmez",
    quote:
      "Amazing experience. I had a Botox and painless insta glow. Dr. Irene was one of the best doctor I've met. She was so honest with what I needed and not. She is so kind and i already can see the results from day 1. My skin is glowing, staffs were so helpful, so kind I am so glad to meet them all. Thank you so much",
    source: "Google",
  },

  // ── Fillers ──────────────────────────────────────────────────────────
  {
    id: "agnes",
    name: "Agnes",
    quote:
      "I was here for a lip filler treatment. It was a very good and pleasant experience. The assistants are very kind and nice they serve a cold towel and a cold tea was very delicious. After I met Dr. Irene we had a long conversation about possibilities and she shared her opinions on what she suggested to do. After I had my lidocaine treatment to minimize the pain, which I had none. The treatment with Dr. Irene went very smoothly and I'm absolutely amazed with her professionalism and with the results I've got it's amazing. I'll definitely come back for another time for other treatments. I recommended to anyone to use their services and treatments. Thank you 😊",
    source: "Fresha",
  },
  {
    id: "monica",
    name: "Monica",
    quote:
      "I've had lip filler with Dr. Irene and the result is super amazing. She listened to my concerns and discussed the expected result I wanted to achieve. I did the lip filler before in another clinic a few months ago, my lip becomes more volumizing but it becomes shapeless and asymmetric :(. I can't thank you enough, Dr. Irene, my lip now looks exactly what I wanted, beautifully shaped and symmetrical. The procedure is also very comfortable, and much less painful compared to my previous experience.",
    source: "Google",
  },
  {
    id: "celine",
    name: "Celine",
    quote:
      "I just visited Healthy Look Aesthetic and had a wonderful experience. I received cheek, temple, nasolabial fold, and lip filler treatments with Dr. Irene. She is incredibly knowledgeable and professional. Dr. Irene speaks perfect English and quickly understood the results I was hoping to achieve. The outcome is amazing—very natural—and the entire treatment was painless and comfortable. I've already planned to return in six months when I visit Bali again!",
    source: "Google",
  },
  {
    id: "bianca",
    name: "Bianca",
    quote:
      "Beautiful clinic set in a unique rainforest like surrounds. Dr was great with a thorough consultation. I had Botox, cheek filler and lip filler which I absolutely loved. Very minimal discomfort, excellent staff, a small amount of bruising not highly noticeable. I have had these treatments elsewhere but very happy with Healthy Look. I recommend them if you are in Ubud!",
    source: "Google",
  },

  // ── HIFU & collagen stimulators ──────────────────────────────────────
  {
    id: "norma",
    name: "Norma",
    quote:
      "I was really impressed with the HIFU treatment. I saw results immediately and it just got better over time. It was not painful and a great way to lift and tighten the skin with no downtime. The Dr was very professional and understood my needs. I have told my friends to do it! Highly recommend.",
    source: "Google",
  },
  {
    id: "rachel",
    name: "Rachel Alexsander",
    quote:
      "Absolutely recommended!! Dr. Irene is amazing, the staff are all so friendly and lovely. I feel and see the results of my HIFU treatment already! I will definitely be back ❤️❤️❤️",
    source: "Google",
  },
  {
    id: "alana",
    name: "Alana Willis",
    quote:
      "Dr Irene was so lovely! I felt safe and all of the staff are amazing. I would definitely recommend. I had HIFU to my lower face and dermapen on my thighs. Everything was very clean and professional. I will be back next time to do more!! 5 stars for sure 🩵",
    source: "Google",
  },
  {
    id: "sheri",
    name: "Sheri Mac",
    quote:
      "I had the HIFU treatment for face neck and jowel area. Absolutely fabulous treatment visible reduction in my sagging skin and very professional staff. Would not hesitate to recommend to others.",
    source: "Google",
  },
  {
    id: "jolene",
    name: "Jolene",
    quote:
      "Wonderfully executed services in a clean and comfortable clinic w/ a lovely caring team. Healthy Look Aesthetic look after you and take the time to understand clearly all your needs and any concerns. I receive HIFU, RF Micro-needling and PRP fairly regularly here and am always very happy with the results and experience.",
    source: "Google",
  },

  // ── Microneedling & RF ───────────────────────────────────────────────
  {
    id: "susan",
    name: "Susan",
    quote:
      "I had Botox and the Sylfirm treatment. I have have Morpheus8 before which was extremely painful. The Sylfirm is much more comfortable and I will get another treatment before returning to Australia. The clinic is very clean and the staff very friendly and professional. The doctor is great and obviously very good and knowledgeable. I would highly recommend this clinic.",
    source: "Fresha",
  },
  {
    id: "fiona",
    name: "Fiona",
    quote:
      "I received the Sylfirm X RF micro-needling with exosomes on face, neck and décolletage and a week later I definitely recommend this for skin rejuvenation. I've noticed a considerable difference in my skin, and the recovery was very quick, just looked a little sunburnt immediately after, and within a day my skin looked great. The clinic is high quality service, facilities and cleanliness. The doctor who performed the treatment was very professional and thorough. The staff were very friendly and helpful. I've had RF before yet this was the best application I've received. I will be returning.",
    source: "Fresha",
  },
  {
    id: "judith",
    name: "Judith Kolk",
    quote:
      "Very happy with the results of my Microneedling treatment about two weeks ago. Making an appointment was very easy to do, and the overall experience is worth the five stars. Dr. Irene recommended the Texture Enhancer and I can say my skin has such a nice glow and I can already see the improvements of small scars post treatment.",
    source: "Google",
  },
  {
    id: "linda",
    name: "Linda Church",
    quote:
      "The results of the Dermapen 4 treatment exceeded my expectations. My skin feels rejuvenated, and I can already see a noticeable improvement in texture and tone. It's clear that the team at this medical spa is dedicated to delivering high-quality services. The friendly staff, serene atmosphere, and the expertise of Dr. Irene make it a five-star experience. I'm already looking forward to my next visit!",
    source: "Google",
  },
  {
    id: "sara",
    name: "Sara",
    quote:
      "The Dermapen treatment was truly rejuvenating, and the skilled staff ensured a comfortable and professional session. The serene ambiance added to the overall relaxation. Highly recommend for those seeking top-notch skincare services in a tranquil setting.",
    source: "Google",
  },

  // ── Body ─────────────────────────────────────────────────────────────
  {
    id: "jonas",
    name: "Jonas Davies",
    quote:
      "I just finished my slim package, super stoked with the results. Had been hitting the gym regularly, but was struggling with belly fat. Four sessions later, I've already shed 5 cm 💪 Heaps more then expected. Best body sculpting experience in Bali, highly recommended!",
    source: "Google",
  },
  {
    id: "betty",
    name: "Betty Closter",
    quote:
      "Got the CM slim treatment done & loved how well they informed me about each step of the procedure! such a lovely team",
    source: "Google",
  },
];

const byId = new Map(testimonials.map((t) => [t.id, t]));

/**
 * The clinic-wide set, used on the homepage, the results page, and as the
 * fallback for treatments the live site never gave reviews of.
 * Order matches the live homepage carousel.
 */
export const GENERAL_TESTIMONIAL_IDS = [
  "michelle",
  "susan",
  "zhanna",
  "noura",
  "alina",
  "nadine",
] as const;

/**
 * slug → review ids, exactly as the live site pairs them. Keys are the
 * real path segments under /ubud-bali/ used by src/data/treatments.ts.
 *
 * The live site repeats one HIFU trio across collagen-stimulator, juvelook,
 * hifu/body and fat-cellulite — all collagen-stimulating or body-contouring
 * pages. That repetition is intentional on their side and is kept.
 */
export const TESTIMONIALS_BY_TREATMENT: Record<string, readonly string[]> = {
  botox: ["angela", "cansu", "danica"],
  "botox/korean": ["olivia", "suellen", "zhanna", "dilara"],
  "dermal-filler": ["noura", "agnes", "monica", "zhanna", "celine", "bianca"],
  "lip-filler": ["agnes", "monica", "zhanna", "celine", "bianca"],
  hifu: ["norma", "rachel", "alana", "jolene"],
  "hifu/body": ["sheri", "alana", "rachel"],
  "collagen-stimulator": ["sheri", "alana", "rachel"],
  juvelook: ["sheri", "alana", "rachel"],
  "fat-cellulite": ["sheri", "alana", "rachel"],
  "microneedling/rf": ["susan", "fiona", "jolene"],
  microneedling: ["judith", "linda", "sara"],
  "chemical-peel": ["nadine"],
  "muscle-sculpting": ["jonas", "betty"],
};

function resolve(ids: readonly string[]): Testimonial[] {
  return ids
    .map((id) => byId.get(id))
    .filter((t): t is Testimonial => Boolean(t));
}

/** The clinic-wide reviews, in live-homepage order. */
export const generalTestimonials = resolve(GENERAL_TESTIMONIAL_IDS);

/**
 * Reviews for one treatment page. Falls back to the clinic-wide set for
 * treatments the live site has no reviews for — see the note at the top of
 * this file about why the fallback is clinic-wide and not treatment-shaped.
 */
export function getTestimonialsForTreatment(slug: string): Testimonial[] {
  const ids = TESTIMONIALS_BY_TREATMENT[slug];
  return ids ? resolve(ids) : generalTestimonials;
}

/**
 * Whether this treatment's reviews actually name this treatment, rather
 * than being the clinic-wide fallback. Pages use it to decide whether they
 * may label the section "<Treatment> reviews" — calling six general clinic
 * reviews "Profhilo reviews" would be a claim none of the reviewers made.
 */
export function hasOwnTestimonials(slug: string): boolean {
  return slug in TESTIMONIALS_BY_TREATMENT;
}
