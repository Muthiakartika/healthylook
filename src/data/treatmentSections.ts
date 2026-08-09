// Long-form treatment copy, extracted verbatim from each treatment page
// on healthylook-aesthetic.com.
//
// ── WHY THIS FILE EXISTS ───────────────────────────────────────────────
// A word-for-word audit against the live site found the rebuilt treatment
// pages missing the clinic's own explanatory copy — "Why Choose HIFU
// Treatment in Bali?", "How Microwave Body Contouring in Bali Works",
// "Sylfirm x vs microneedling", and so on. The wording is
// treatment-specific (the Botox version names Allergan and Xeomin, the
// Sylfirm version cites FDA approval), so it could not be written once and
// shared.
//
// ── TWO SHAPES, BECAUSE THE SITE HAS TWO ───────────────────────────────
// `points` — short claim bullets, e.g. "Slight redness resolves within 24
//   hours". Most treatments present their benefits this way.
// `blocks` — real prose, optionally under a sub-heading. Three pages
//   (Sylfirm X, Juvelook, Lysiwave) carry several hundred words of
//   explanation each, including comparison sections like "Microwaves vs
//   Cryolipolysis in Bali". Flattening those into bullets would have
//   mangled them, so they keep their structure.
//
// 29 sections, ~2604 words, keyed by treatment slug.

export type SectionBlock = { heading?: string; paragraphs: string[] };

export type TreatmentSection = {
  title: string;
  points?: string[];
  blocks?: SectionBlock[];
};

export const treatmentSections: Record<string, TreatmentSection[]> = {
  "botox": [
    {
      title: "Certified & Trusted Botox Provider in Ubud Bali",
      points: [
        "Are you already seeing the formation of wrinkles whenever you laugh? And prominent forehead lines when you raise your eyebrow or frown? Botox treatment might be suitable for you.",
      ],
    },
    {
      title: "What is A Botox",
      points: [
        "Botox is a purified neurotoxin derived from the Clostridium botulinum bacterium. During a Botox injection, the product is carefully administered into targeted muscles to temporarily reduce muscle activity, helping smooth dynamic wrinkles. It is also used to slim the face (V-shape), treat bruxism and excessive sweating, and contour specific areas of the body.",
      ],
    },
    {
      title: "INJECTABLES",
      points: [
        "Enjoy 15% off for min 40 units or 10% off for min 30 units",
      ],
    },
    {
      title: "Why Should I choose Healthy Look Aesthetic ?",
      points: [
        "We provide guarantee after two weeks and before 1 month if you agree with the recommended dose",
        "Botox Alergan USA starts from IDR 80.750/unit*",
      ],
    },
  ],
  "dermal-filler": [
    {
      title: "Why Should I choose Healthy Look Aesthetic ?",
      points: [
        "Our aesthetic & anti aging doctor will give you honest opinion to enhance your beauty",
        "In case you need a subtle enhancement, we can inject less than 1 ml, and keep the remaining filler for 2 weeks. We offer a complimentary touch-up for you if required.",
        "We use best worldwide filler products like Juvederm, teosyal, croma saypha with affordable price",
      ],
    },
  ],
  "hifu": [
    {
      title: "Our Special HIFU Treatment with Linear Z",
      points: [
        "Linear Z HIFU treatment is the ultimate non-invasive solution for face lifting and neck tightening. As the first and only aesthetic clinic in Bali to offer Linear Z, the world’s most advanced and fastest HIFU technology, we are setting a new standard in non-surgical aesthetics. Linear Z uses high-intensity focused ultrasound (HIFU) to deliver focused waves into the skin, promoting collagen regeneration and tightening the skin by raising tissue temperature in a stable manner. Unlike traditional HIFU, Linear Z is more effective and significantly less painful, providing an unmatched lifting experience. It is the only HIFU technology in the world that can induce fat proliferation, making it ideal for treating hollow areas. Linear Z targets multiple layers beneath the skin to stimulate collagen production, reduce excess fat, and tighten the SMAS layer. With 32 customizable depth and mode settings, Linear Z offers personalized treatments to meet the unique needs of each client, ensuring optimal results. Experience the future of non-surgical aesthetics with Linear Z HIFU in Bali for a firmer, tighter, and more youthful appearance.",
      ],
    },
    {
      title: "Why Choose HIFU Treatment in Bali?",
      points: [
        "Safe Treatment without Downtime",
        "Lift your face without surgery, No Needle Involved",
        "Can persist up 6-12 months. The effect is cumulative",
        "Achieve a more defined jawline",
        "Stimulates collagen for a natural lifting effect.",
        "Reduce unwanted stubborn fat in your double chin, lower third of face, or neck",
      ],
    },
  ],
  "profhilo": [
    {
      title: "Your Profhilo Journey in Ubud Bali",
      points: [
        "Embrace the tranquility of Ubud as you undergo your Profhilo treatment. Healthy Look Aesthetic is designed to provide a serene environment, allowing you to relax while taking a step towards healthier, more beautiful skin.",
        "Begin your Profhilo journey in Ubud Bali with a personalized consultation. Our skilled doctor will assess your skin and discuss your aesthetic goals to create a tailored treatment plan just for you.",
        "The Profhilo treatment involves a series of injections strategically placed to stimulate collagen and elastin production. The process is painless with minimal downtime",
        "Experience improved skin texture, and intense hydration. Profhilo works from the inside out, addressing fine lines, wrinkles, and sagging skin for a rejuvenated appearance.",
      ],
    },
  ],
  "microneedling": [
    {
      title: "What Skin Conditions Improve with Microneedling?",
      points: [
        "Dermapen 4 is the only micro-needling pen with a dedicated scar treatment. The needles can penetrate up to 3 mm thus effectively improving the appearance of acne scars, surgical scars, and striae.",
        "Dermapen could minimize pores by creating thousands of flawless micro-injuries to activate the skin’s natural healing response. The new collagen will tighten the pores to appear smaller",
        "Dermapen 4 can reduce the appearance of lines, wrinkles, and thinning skin due to reduced collagen in the skin. Microneedling stimulates your skin’s natural collagen production, boosting elasticity and repairing flaws.",
        "The microneedling utilizes 1,920 micro-channels to break down existing fibrous tissue and encourages the production and distribution of new collagen to remodel the stretch mark scar",
        "Microneedling stimulates the formation of new blood vessels to provide better nutrition to the bulb of the hair which is essential for healthy hair growth.",
        "Microneedling removes the risk of post-inflammatory hyperpigmentation, making it a suitable procedure for all Fitzpatrick skin types.",
      ],
    },
  ],
  "facial/medi": [
    {
      title: "Why Should I choose Healthy Look Aesthetic?",
      points: [
        "Dermalogica, Tegoder, Dermapen World, Skin Matrix, Janssen are some of premium professional brands that we partner with",
      ],
    },
  ],
  "ipl": [
    {
      title: "What’s the Benefit of having IPL in Ubud Bali?",
      points: [
        "Semi Permanent Hair Reduction",
        "Reducing the Active Acne & decrease sebum production",
        "Freckles, solar keratosis, and lentigines",
        "Treat redness, rosacea, PIE, and telangiectasia",
        "Increase collagen production and improve the skin's elasticity",
      ],
    },
  ],
  "carboxy-therapy": [
    {
      title: "Why Should I choose Carboxy Therapy in Ubud?",
      points: [
        "Safe Treatment without Downtime",
      ],
    },
  ],
  "prp/hair": [
    {
      title: "What Areas Can Be Treated With PRP?",
      points: [
        "An effective treatment to enhance the skin texture, reduce the appearance of enlarged pores, scars, and diminish signs of aging such as fine lines and wrinkles",
        "By inducing the production of collagen & elastin, the skin is rejuvenated for stretch marks, cellulite, and scarring",
        "Stimulate hair follicles, encourage new hair growth, and thicken the existing hair.",
      ],
    },
  ],
  "microneedling/rf": [
    {
      title: "What is sylfirm x Actually?",
      blocks: [
        {
          paragraphs: [
            "Sylfirm X is a radiofrequency microneedling device. Ultra-fine insulated needles pass through the skin's surface and release RF energy into the deeper layers, where it stimulates collagen and repairs damaged tissue.The healing happens underneath, so downtime stays minimal and the treatment is safe for skin tones that typically react badly to heat-based devices.",
            "Look no further than Sylfirm X, the world’s first FDA-approved dual-wave RF microneedling system. It combines pulsed wave and continuous wave radiofrequency to treat a variety of skin concerns with customized treatment settings.",
            "For facial treatments, needle depth is carefully selected based on the treatment area and concern, with a maximum depth of 1.5 mm. This helps address concerns such as pigmentation, redness, acne scars, and overall skin rejuvenation across all skin types, including darker skin tones.",
            "Targeted Solutions for 12 FDA-Approved Indications • Treats Melasma • Treats PIH • Treats Redness • Minimises Pores • Lifts & Tighten the Skin • Reduce Wrinkles • Skin Rejuvenation • Treats Rosacea • Reduces Stretch Mark • Improves Acne Scar • Treats Acne • Promote Scalp Circulation",
          ],
        },
      ],
    },
    {
      title: "How Sylfirm X RF Microneedling work ?",
      blocks: [
        {
          paragraphs: [
            "Radiofrequency (RF) generates heat within the skin (40-60°C), promoting skin rejuvenation and scar treatment. Unlike lasers, RF is unaffected by chromophores' absorption coefficients, making it safe for all skin types including the dark skin type. Microneedling creates controlled micro-injuries, triggering the release of growth factors and stimulating the skin's natural healing process. Additionally, the needles aid in breaking down scar tissue.",
            "Sylfirm X combines RF and microneedling in a minimally-invasive procedure. RF energy is precisely delivered deeper into the skin through microneedles. This controlled delivery induces micro-injuries, stimulating collagen regeneration and wound healing. Using Regional Regeneration Radio Repeated Pulse (RP) microneedling, Sylfirm X targets abnormal vessels associated with conditions like melasma and rosacea.",
          ],
        },
      ],
    },
    {
      title: "Sylfirm x vs microneedling",
      blocks: [
        {
          paragraphs: [
            "Sylfirm X treatment stands out for its exceptional precision, enabling electrodes to penetrate to the desired depth, covering all dermal laye­­rs while preserving the superficial layer. While microneedling pioneered skin rejuvenation through natural healing factors, RF Microneedling elevated it to new level. The additional heat and energy delivered by RF-powered microneedles enable healing in deeper skin layers without added discomfort. Sylfirm X allows for fewer sessions than the traditional microneedling while providing long-lasting results. Compared to traditional microneedling, Sylfirm X offers faster, more effective, and more comfortable treatment.",
          ],
        },
      ],
    },
    {
      title: "How long does sylfirm x last?",
      blocks: [
        {
          paragraphs: [
            "The longevity of Sylfirm X results depends on the condition being treated, your skin's natural aging process, and how well you maintain your skin after treatment. While many people notice visible improvements after completing their recommended treatment plan, the results are not permanent, and maintenance sessions are typically recommended.",
            "It's also important to understand that Sylfirm X works gradually. The radiofrequency energy stimulates your skin's natural healing response, with collagen production continuing for several weeks to months after treatment. Improvements in redness and skin texture may become noticeable within a few weeks, while firmer, smoother skin develops progressively over time.",
            "Results also vary by concern. Skin tightening and fine lines generally require periodic maintenance as collagen naturally declines with age. Acne scars can show long-lasting structural improvement, although complete scar removal is not possible. Melasma is a chronic condition that can recur due to sun exposure, hormonal changes, or other triggers, so ongoing maintenance and diligent sun protection are essential for managing pigmentation.",
            "To help maintain your results, our practitioner may recommend follow-up treatments based on your skin condition, along with daily broad-spectrum sunscreen and a consistent skincare routine especially in sunny climates like Bali.",
          ],
        },
      ],
    },
    {
      title: "How Often Should You Do Sylfirm X?",
      blocks: [
        {
          paragraphs: [
            "Most treatment plans start with three to four sessions spaced two to four weeks apart, followed by maintenance every six to twelve months. The initial course matters more than any single session. Each treatment builds on the last, and the spacing gives your skin time to complete one repair cycle before the next round of stimulation. Skipping ahead doesn't speed anything up. The number of sessions varies by concern:",
            "Melasma and pigmentation: Often four to six sessions, sometimes more, with ongoing maintenance every three to six months since the condition recurs.",
            "Skin tightening and wrinkles: Three to four sessions, then annual top-ups.",
            "Acne scarring: Four to six sessions, spaced four weeks apart to allow full healing.",
            "Active acne and redness: Three to four sessions, with maintenance based on how the skin responds.",
          ],
        },
      ],
    },
    {
      title: "Why Should I choose RF Microneedling in Bali?",
      blocks: [
        {
          paragraphs: [
            "The World’s First & Only FDA Approved Dual Wave RF Microneedling",
          ],
        },
        {
          heading: "Noticeable Improvement after a Single Session",
          paragraphs: [
            "Result after 1 week with continual improvement over the next 10-12 weeks",
          ],
        },
      ],
    },
  ],
  "juvelook": [
    {
      title: "Healthy Look Painless Juvelook Experience in Bali",
      blocks: [
        {
          paragraphs: [
            "Less pain, Minimal bruising, Just results . . .",
            "Introducing Healthy Look’s Painless Juvelook Cocktail that combining Juvelook, Hyaluronic Acid, and Goldie ingredients with the advanced Dermashine Pro injector from South Korea, this treatment delivers glowing skin — with no pain, just gain. Dermashine Pro ensures the Juvelook is delivered comfortably and safely into the skin. Its auto-sensing technology allows for precise, uniform injections, reducing the risk of complications and maximizing results.",
            "By targeting the dermis, this technology stimulates collagen production and boosts skin hydration for a youthful glow. Equipped with negative pressure, the injector creates seamless contact between needles and skin, minimizing leakage and product wastage common with other devices. The vacuum system stabilizes the skin for greater precision, while ultra-fine 32G–34G needles provide a gentler, more comfortable treatment. The multi-needle cartridge delivers multiple micro-injections simultaneously, reducing pain and enabling a fast, effective session. With Dermashine Pro, expect faster recovery and minimal bruising.",
            "The best part? We offer this Healthy Look Painless Juvelook upgrade at no extra charge.",
          ],
        },
      ],
    },
    {
      title: "Be Empowered to Feel Truly Confident",
      blocks: [
        {
          heading: "FAQ Juvelook in Bali",
          paragraphs: [
            "What results can I expect from the Juvelook treatment in Bali?",
            "How is Juvelook different from traditional dermal fillers?",
            "How long does Juvelook in Bali last?",
            "How soon will I see results of Juvelook in Bali?",
            "Am I a suitable candidate for the Juvelook in Bali?",
            "Is the Juvelook in Bali safe?",
            "Are there any side effects of Juvelook in Bali?",
            "Is the Juvelook in Bali painful?",
            "Is there any downtime with the Juvelook treatment in Bali?",
            "How is the after care treatment post Collagen Stimulator in Bali?",
          ],
        },
      ],
    },
  ],
  "fat-cellulite": [
    {
      title: "How Microwave Body Contouring in Bali Works",
      blocks: [
        {
          heading: "Fat Reduction",
          paragraphs: [
            "Lysiwave uses targeted microwave technology to selectively heat and destroy fat cells beneath the skin while preserving surrounding tissues. This makes it an effective treatment for stubborn fat areas that often remain resistant to diet and exercise.",
            "Unlike many conventional technologies, the skin has a limited ability to absorb microwave energy but efficiently transfers it to deeper tissues. Fat cells readily absorb microwave energy and convert it into heat. Lysiwave delivers approximately 80% of its energy directly into subcutaneous fat, while only 20% remains in the superficial skin layers. Because fat has low conductivity, the energy stays concentrated within the fat layer without affecting the underlying muscles. At the same time, 90% cooled pure oxygen is delivered to the skin surface to maintain comfort, protect the epidermis, and prevent overheating. This combination enables deeper tissue treatment while keeping the skin comfortable throughout the procedure. The oxygen flow also supports microcirculation, cellular metabolism, and skin hydration.",
          ],
        },
        {
          heading: "Tighten the Skin",
          paragraphs: [
            "Controlled heating stimulates collagen remodeling and neocollagenesis. Tissue temperatures of approximately 43°C promote collagen and elastin contraction for immediate skin tightening, while long-term collagen production improves skin firmness and elasticity over time.",
          ],
        },
        {
          heading: "Smooth the Cellulite",
          paragraphs: [
            "Cellulite develops when fibrous connective tissue pulls the skin downward while fat cells push upward, creating the familiar dimpled or uneven appearance often described as orange peel skin. Lysiwave targets both the fibrotic collagen bands and the underlying fat cells responsible for cellulite formation. This process promotes the disencapsulation of trapped adipocytes, improving tissue flexibility and microcirculation. At the same time, microwaves stimulate lipolysis, blood circulation, and tissue oxygenation, contributing to smoother skin texture and a visible reduction in cellulite.",
          ],
        },
      ],
    },
    {
      title: "Be Empowered to Feel Truly Confident",
      blocks: [
        {
          heading: "Microwaves vs Radiofrequency in Bali",
          paragraphs: [
            "Many patients searching for cellulite treatment in Bali compare microwave technology with traditional radiofrequency treatments. Although both technologies use heat to improve body contouring, microwave technology offers distinct advantages over conventional radiofrequency (RF). RF energy is primarily absorbed by the superficial skin layers, with approximately 80% of the energy remaining within the skin. As a result, its action on deeper fat tissue is more limited (20%), and treatment intensity must be carefully controlled to prevent overheating of the skin surface. In contrast, microwave technology is designed to selectively target subcutaneous fat. Approximately 80% of the microwave energy is concentrated within the targeted fat layer, while only 20% is absorbed by the superficial skin layers. This unique energy distribution allows higher temperatures to be achieved within fat tissue while maintaining safety and comfort at the skin surface.",
          ],
        },
        {
          heading: "Microwaves vs Cryolipolysis in Bali",
          paragraphs: [
            "Cryolipolysis and microwave body contouring are among the most popular non-surgical fat reduction treatments available in Bali today. Both Lysiwave and cryolipolysis are designed to reduce unwanted fat, but they work very differently. Cryolipolysis uses controlled freezing to damage fat cells, which are gradually eliminated by the body over several weeks. While effective for fat reduction, treatment may be associated with temporary numbness, swelling, bruising, redness, or discomfort. Because cryolipolysis primarily focuses on fat reduction, separate treatments may be required to address cellulite and skin laxity. Lysiwave uses microwave technology to selectively heat fat cells while simultaneously improving cellulite and stimulating collagen production for skin tightening. The treatment feels like a warm massage without suction, freezing, needles, or downtime.",
          ],
        },
      ],
    },
  ],
  "prp": [
    {
      title: "Healthy Look's PRP with Minimum Downtime",
      blocks: [
        {
          heading: "FAQ about PRP in Bali",
          paragraphs: [
            "How is the Process of PRP in Ubud Bali?",
            "How long is the downtime of PRP in Bali?",
            "When Can I See the Result of PRP in Bali?",
            "Does it hurt?",
            "Are there possible side effects of PRP facial rejuvenation?",
          ],
        },
      ],
    },
    {
      title: "What Areas Can Be Treated With PRP?",
      blocks: [
        {
          paragraphs: [
            "PRP has a multiple benefits in the aesthetic practices for skin rejuvenation & hair growth.",
            "An effective treatment to enhance the skin texture, reduce the appearance of enlarged pores, scars, and diminish signs of aging such as fine lines and wrinkles",
            "By inducing the production of collagen & elastin, the skin is rejuvenated for stretch marks, cellulite, and scarring",
            "Stimulate hair follicles, encourage new hair growth, and thicken the existing hair.",
          ],
        },
      ],
    },
  ],
  "hifu/body": [
    {
      title: "How does HIFU Body work?",
      blocks: [
        {
          paragraphs: [
            "The Linear Z uses high-intensity focused ultrasound (HIFU) to achieve multiple effects:",
          ],
        },
        {
          heading: "Heat-Induced Adipocyte Necrosis",
          paragraphs: [
            "It generates heat above 58°C precisely in the targeted area without affecting adjacent tissues, ensuring safety and no skin damage. Focused energy disrupts fat cells, leading to apoptosis (cell death) and autophagy, reducing subcutaneous adipose tissue (SAT).",
          ],
        },
        {
          heading: "Deep Penetration with Body Contour Cartridges",
          paragraphs: [
            "With 9/11/13 mm cartridges, it effectively targets fat deposits deeper than any conventional HIFU device",
          ],
        },
        {
          heading: "Multilayer Targeting",
          paragraphs: [
            "Linear Z HIFU doesn't only target subcutaneous fat for fat reduction, but also target the dermis for firmer skin and SMAS Layer for a lifting effect",
          ],
        },
        {
          heading: "Collagen Stimulation",
          paragraphs: [
            "The treatment stimulates new collagen production, enhancing skin elasticity and delivering gradual improvement over months.",
          ],
        },
      ],
    },
    {
      title: "Why should i choose HIFU Body in Bali?",
      blocks: [
        {
          heading: "Tailor each treatment to match your specific goals",
          paragraphs: [
            "Using the latest HIFU technology for optimal results.",
          ],
        },
      ],
    },
  ],
  "fat-dissolving-injections": [
    {
      title: "Why Should I Fat Dissolving Injection in Ubud?",
      blocks: [
        {
          paragraphs: [
            "The Injection is performed by certified doctor with years of experience",
            "We use premium products that is much more painless compared to the general product in the market",
          ],
        },
      ],
    },
  ],
  "autologues-micrograft-hair-restoration": [
    {
      title: "Be Empowered to Feel Truly Confident",
      blocks: [
        {
          paragraphs: [
            "Why Should I chooseAutologous Micrograft Hair Restoration in Bali?",
          ],
        },
      ],
    },
  ],
};

export function getSections(slug: string): TreatmentSection[] {
  return treatmentSections[slug] ?? [];
}
