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
    // "What is A Botox" used to sit here with the clinic's definition
    // paragraph. That exact paragraph is now this treatment's `intro` in
    // treatments.ts, which the detail page renders higher up as the lead —
    // so keeping it here printed it twice on the page. Same de-duplication
    // applied to lip-filler, botox/korean, facial and
    // slimming-body-contouring: where a section's opening paragraph is
    // already the treatment's `intro`, `intro` wins and the section keeps
    // only what comes after it.
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

  // ─────────────────────────────────────────────────────────────────────
  // The remaining 15. An audit found these treatments rendering with no
  // long-form copy at all — the detail pages showed a price table, a FAQ
  // block and nothing explaining the treatment, while the live site had
  // several hundred words for each. Same extraction rules as above:
  // verbatim, in the live page's own order, with two deliberate cuts.
  //
  // 1. FAQ sections are NOT copied here. 13 of these 15 already have their
  //    questions in treatmentFaqs.ts, and duplicating them would put the
  //    same answer on the page twice and give it two places to drift.
  // 2. Prices are NOT copied into headings. The live IV Drip page prints
  //    "Immune Booster IDR 1.100 K" as a sub-heading; the figure is kept
  //    only in that treatment's priceGroups, so the price list stays the
  //    single source of truth. The booster names are unchanged.
  // ─────────────────────────────────────────────────────────────────────

  "collagen-stimulator": [
    {
      title: "Collagen Stimulator in Bali",
      blocks: [
        {
          paragraphs: [
            "Want to rejuvenate your face without looking overdone? Interested in long-term skin rejuvenation rather than a quick fix? Designed to stimulate your body's natural collagen, collagen stimulator are injected into the deep dermal layer to support the skin's structural framework, help to improve firmness, elasticity, and overall skin quality. Unlike dermal fillers, which primarily fill the volume loss, collagen stimulators work gradually by encouraging your skin to rebuild its own collagen.",
            "Skin aging is an inevitable part of life, and from around the age of 25, collagen production begins to decline by approximately 1% each year. As collagen levels decrease, the skin becomes thinner, less elastic, and more prone to fine lines, wrinkles, and sagging. Factors such as sun exposure, stress, smoking, and poor sleep can further accelerate this process. By stimulating collagen production and supporting tissue remodelling, collagen stimulators help restore skin firmness, improve elasticity and texture, and soften wrinkles. In addition, they create a supportive foundation within the skin, making future rejuvenation treatments more effective and often reducing the amount of dermal filler required.",
          ],
        },
      ],
    },
    {
      title: "Available Collagen Stimulators at Healthy Look Aesthetic",
      blocks: [
        {
          heading: "PLLA – Sculptra",
          paragraphs: [
            "Sculptra will gradually work to tighthen the face and improves skin firmness. The PLLA microparticles activate fibroblasts, encouraging new collagen formation that strengthens the skin's underlying structure. As the particles are gradually absorbed, the newly produced collagen remains, providing natural-looking rejuvenation that can last up to two years.",
            "Common treatment areas include the cheeks, temples, and mid-face",
          ],
        },
        {
          heading: "CaHA – Collagen Stimulating Dermal Filler",
          paragraphs: [
            "CaHA (calcium hydroxyapatite) is a naturally occurring mineral found in the body. The gel provides immediate volume, while CaHA microspheres stimulate collagen production, creating long-term structural support. This dual action makes CaHA effective for lifting and contouring. As the CaHA particles are gradually absorbed, the newly formed collagen remains, helping maintain long-lasting results (12-18 months).",
            "Common treatment areas include the cheeks, nasolabial folds, marionette lines, jawline, neck, and hands.",
          ],
        },
        {
          heading: "PDLLA – Juvelook Classic",
          paragraphs: [
            "A hybrid skin booster that combines PDLLA (Poly-D,L-Lactic Acid) with non-crosslinked hyaluronic acid to stimulate collagen production and improve skin hydration. It does not add volume or provide lifting, think of it as a collagen-stimulating skin booster. It helps improve skin texture, fine lines, pore appearance, and overall radiance,",
            "Common treatment areas include the face, neck, and delicate areas such as the under-eye region.",
          ],
        },
        {
          heading: "PCL – Gouri",
          paragraphs: [
            "Gouri is a collagen-stimulating injectable that uses liquid Polycaprolactone (PCL) to provide mild lifting and tightening effect. It is particularly suitable for individuals with fuller faces who want to improve skin laxity and facial contours without adding extra volume. It lasts around 6-9 months",
            "Common treatment areas include the face and jawline.",
          ],
        },
      ],
    },
    {
      title: "What's the Best Collagen Stimulator in Bali?",
      blocks: [
        {
          paragraphs: [
            "We believe that every face and skin type is unique. Each collagen stimulator works differently and targets specific aging concerns. The most suitable treatment depends on your facial anatomy, skin condition, aesthetic goals, and desired outcome.",
            "For example:",
            "Sculptra® (PLLA) is ideal for restoring age-related volume loss while improving facial structure and contour over time.",
            "CaHA is an excellent option for patients seeking both immediate lifting and volume and long-term collagen stimulation.",
            "Juvelook Classic (PDLLA) is best suited for improving skin quality, fine lines, enlarged pores, and under-eye concerns without adding volume.",
            "Gouri (PCL) is particularly suitable for patients with facial sagging who prefer skin tightening and rejuvenation without additional fullness.",
            "To determine the most appropriate treatment for your concerns, book a personalised consultation with one of our certified aesthetic doctors.",
          ],
        },
      ],
    },
  ],

  "sculptra": [
    {
      title: "Sculptra in Bali",
      blocks: [
        {
          paragraphs: [
            "Are you looking for a natural enhancement that helps you look fresher without it being obvious you've had a treatment? Sculptra in Bali is an advanced regenerative option available at a healthy look aesthetic clinic, designed to improve skin quality from within while maintaining a naturally refined appearance.",
            "Sculptra is made from poly-L-lactic acid (PLLA) that stimulates the skin's natural collagen and elastin production. Unlike traditional fillers that add immediate volume, Sculptra works gradually to restore the skin's structure for subtle, natural-looking, and long-lasting rejuvenation. From the 20s onward, collagen production gradually declines, elastin becomes less resilient, and adipocytes (fat cells) not only decrease in number but also change in quality. This leads to reduced structural support. Sculptra addresses these changes by encouraging the skin to restore its own foundation naturally.",
          ],
        },
      ],
      points: [
        "Enhances skin elasticity and firmness",
        "Reduces skin laxity",
        "Smooths fine lines and wrinkles",
        "Provides subtle lifting and structural support",
        "Restores natural facial volume",
      ],
    },
    {
      title: "Why Choose Sculptra in Bali?",
      blocks: [
        {
          paragraphs: [
            "Sculptra is chosen for its ability to deliver natural, progressive rejuvenation. It stimulates collagen and elastin while supporting skin structure and adipose tissue for improved firmness and quality. With its patented PLLA-SCA formulation, Sculptra works across all layers of the skin for consistent results. Backed by over 25 years of clinical use since 1999, FDA approval, and availability in more than 60 countries, it is a globally trusted regenerative treatment. Results typically begin to appear after around 4 weeks and continue to improve over time. Most patients require 2–3 sessions, with results lasting up to 2 years or more.",
          ],
        },
      ],
    },
    {
      title: "How Sculptra in Bali Works?",
      blocks: [
        {
          paragraphs: [
            "PLLA is biocompatible and biodegradable, meaning it is naturally broken down by the body over time. It has been safely used in medical applications for decades and carries a low risk of allergic reactions. Its gradual mechanism reduces the risk of overfilled.",
            "Unlike traditional fillers that provide immediate volume, Sculptra works gradually by stimulating your body's own collagen and elastin production. As a collagen biostimulator, it encourages the body's natural regenerative processes to gradually restore what aging has diminished",
            "Once injected into the deeper layers of the skin, PLLA microspheres activate fibroblasts — the cells responsible for collagen production. Over time, this collagen-stimulating process reinforces the skin's structural foundation while gradually restoring natural-looking facial volume from within.",
            "Visible improvements begin around 4–6 weeks and continue to develop over several months. Because the results come from your own collagen production, the outcome appears natural, subtle, and aligned with a healthy skin.",
          ],
        },
      ],
    },
  ],

  "lip-filler": [
    {
      // Opening paragraph omitted — it is this treatment's `intro`.
      title: "Premium Lip Fillers in Ubud Bali",
      blocks: [
        {
          heading: "Expert Care by Certified Aesthetic Doctors",
          paragraphs: [
            "At Healthy Look Aesthetic Center in Ubud, your safety & satisfaction are our top priorities. That's why our lip filler treatments are performed by certified aesthetic doctors who have undergone rigorous training by industry leaders like Allergan and Galderma. The success of lip filler treatment depends not only on the product used but also on the experience and injection technique of the injector. With their expertise and attention to detail, you can trust that you're in capable hands throughout your treatment journey.",
          ],
        },
        {
          heading: "Personalized Consultation",
          paragraphs: [
            "We understand that every individual is unique, and so are their aesthetic goals. That's why we offer personalized consultations where you can discuss your desired lip. Whether you're looking for a subtle, natural-looking enhancement or a more dramatic change like a Russian lip, we tailor our approach to suit your preferences. Our doctor will also analyze your unique facial features and advise the appropriate lip volume accordingly.",
          ],
        },
        {
          heading: "Lip Booster Treatment",
          paragraphs: [
            "At Healthy Look Aesthetic Center in Ubud, we offer a range of lip treatments to address various concerns and goals. In addition to lip augmentation, we also provide lip booster treatments for hydration and rejuvenation without adding extra volume. Hyaluronic acid-based fillers are commonly used in these treatments as they help retain moisture and improve lip texture while maintaining a natural appearance. Whatever your needs may be, our team will work with you to create a customized treatment plan that meets your expectations.",
          ],
        },
        {
          heading: "Free Touch-Up Sessions",
          paragraphs: [
            "We understand that achieving the perfect lip volume can be a journey. To ensure your satisfaction, we offer free touch-up sessions if you still have remaining filler. This commitment to excellence means that you can feel confident in your decision to enhance your lips with us.",
          ],
        },
      ],
    },
  ],

  "botox/korean": [
    {
      // Opening paragraph omitted — it is this treatment's `intro`.
      title: "Legal Korean Botox Provider in Bali",
      blocks: [
        {
          heading: "American vs Korean Botox",
          paragraphs: [
            "The main difference is in price, Korean Botox is cheaper than the american botox. Both American and Korean Botox products utilize the same active substance (type A). In the terms of result, clinical trials have shown no significant difference in effectiveness between American and Korean Botox.",
          ],
        },
        {
          heading: "Is It Safe to Get Korean Botox?",
          paragraphs: [
            "Yes, it is safe to get Korean Botox in Bali when you choose a reputable provider like Healthy Look Aesthetic. We source our Nabota from official distributors who adhere to strict quality control standards. The product is carefully maintained within a cold-chain system to preserve its stability and effectiveness, ensuring consistent, high-quality treatment results.",
          ],
        },
        {
          heading: "Verifying Authentic Korean Botox?",
          paragraphs: [
            "To verify that your provider is using genuine Korean Botox, ask about the brand they use. Legal Korean botulinum toxin brands include Nabota and Letybo. Authentic products should feature Indonesian labeling and an official registration number from the Indonesian health authority, helping distinguish genuine products from illegal or unregulated alternatives.",
          ],
        },
        {
          heading: "How much is Korean Botox?",
          paragraphs: [
            "The cost of Korean Botox varies depending on the brand and whether it is sourced through official distribution channels. Legally approved products undergo strict quality control, helping ensure both safety and consistent treatment outcomes.",
            "At Healthy Look Aesthetic, we use only genuine, legally approved products, including Botox® by Allergan (USA) and Nabota, a premium Korean botulinum toxin. Nabota is the first Korean botulinum toxin to receive U.S. FDA approval, reflecting its high manufacturing standards and established safety profile.",
            "Compared with Botox® by Allergan, the effects of Korean botulinum toxin products such as Nabota may have a slightly shorter duration for some individuals, although longevity varies depending on factors such as the treatment area, dosage, and individual metabolism. We offer Nabota at competitive pricing, allowing you to enjoy high-quality Korean botulinum toxin treatments without compromising on safety. Our experienced medical team will recommend the most suitable product based on your aesthetic goals, treatment plan, and desired duration of results.",
          ],
        },
      ],
    },
    {
      title: "Why Should I choose Healthy Look Aesthetic?",
      blocks: [
        {
          heading: "Handled by Certified Doctor",
          paragraphs: [
            "The Botox is injected by certified doctor with years of experience",
          ],
        },
        {
          heading: "Free Touch Up*",
          paragraphs: [
            "We provide free touch-up within 1 month if you agree with the dose recommended by our doctor",
          ],
        },
        {
          heading: "Affordable Price",
          paragraphs: [
            "Discount is available for purchasing more than 30 units",
          ],
        },
      ],
    },
  ],

  "facial": [
    // The "Best Facial Experience in Ubud" opener is this treatment's
    // `intro`, so the page leads with it and it is not repeated here.
    {
      title: "Choosing Facial Treatments in Ubud",
      blocks: [
        {
          heading: "Trusted Skincare Brands from Around the World",
          paragraphs: [
            "Healthy Look Aesthetic Center Ubud uses trusted skincare brands such as Dermalogica, Tegoder, and Casmara. These brands are widely used in aesthetic care and selected for their consistent quality and proven performance. Combined within our medi-facial treatments, they help address various skin concerns, from acne and dull skin to dryness and signs of aging.",
          ],
        },
        {
          heading: "Signature Facial Massage",
          paragraphs: [
            "Every facial at Healthy Look Aesthetic Center Ubud includes our signature massage, with our skilled therapists guiding the session to enhance both comfort and results. They use gentle techniques to release tension and help you fully relax throughout the treatment, while supporting the effectiveness of the facial care. This combination of care and attention ensures a calming experience that nourishes your skin and leaves you feeling refreshed.",
          ],
        },
        {
          heading: "Wide Range of Facial Treatments",
          paragraphs: [
            "A wide selection of facial treatments is available to suit different skin needs. Options range from refreshing and maintenance facials to targeted treatments for acne-prone, aging, or tired-looking skin, allowing clients to choose based on their skin condition and goals.",
          ],
        },
        {
          heading: "Free Consultation",
          paragraphs: [
            "Free consultations are offered before each treatment to help clients better understand their skin condition and the options available. During the consultation, our experienced therapist assess your skin and provide personalized recommendations based on your individual needs. This guidance allows you to make informed choices and feel confident about the facial treatment that best suits your skin.",
          ],
        },
        {
          heading: "Advanced Non-Invasive Technology",
          paragraphs: [
            "Facials at Healthy Look Aesthetic Center Ubud provide more than a simple treat for your skin. Our skilled therapists use non-invasive technologies such as HIFU, IPL, PDT, Radiofrequency, and the Hydra Glow Facial Machine to address specific skin concerns from the first session. Whether it's acne, dullness, dryness, or loss of firmness, each treatment is adjusted to meet your skin's needs. The combination of careful technique and advanced technology helps your skin look healthier and feel refreshed, while ensuring a comfortable and relaxing experience throughout the session.",
          ],
        },
      ],
    },
  ],

  "skin-booster": [
    {
      title: "Skin Booster in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "Have you wondered why your skin looks dull even though you already do your skincare routine religiously? Do you always have problems with dehydrated skin? Have you started noticing the fine wrinkles? Skin booster in Ubud Bali is an ideal solution to boost your skin hydration and give a youthful look by delivering a microinjection of hyaluronic acid into your skin. Hyaluronic acid is naturally found in our skin, however, as same as collagen, its amount and quality decrease as we age. Nowadays, many skincare products also contain hyaluronic acid, unfortunately, the absorption rate is very minimal. Moreover, the effect is very short as it will be degraded by our body's enzyme, called hyaluronidase.",
            "With skin boosters, we are able to inject exactly in the target area to improve the appearance of aging such as dull skin, dry skin, and fine wrinkles. Skin booster also comes with advanced technology that makes it last longer to replenish natural hydration levels. The hyaluronic acid injection will promote new collagen & elastin formation to provide improvement in elasticity and plumpness.",
            "We provide premium world class skin boosters in Bali such as profhilo, juvederm, restylane vital, fillmed nctf 135 HA, teosyal, cell booster, neauvia, and more",
          ],
        },
      ],
      points: [
        "Long-lasting moisturizer to combat dry & dehydrated skin",
        "Improves the appearance of thin skin and fine lines",
        "Enhance the skin's natural glow",
      ],
    },
    {
      title: "Healthy Look's Painless Skin Booster in Bali",
      blocks: [
        {
          paragraphs: [
            "Less pain, less bruising, just beautiful results..",
            "Experience the next generation of skin rejuvenation with Dermashine Pro, our advanced skin booster technology from South Korea — designed to deliver results with comfort and care. Unlike traditional methods, Dermashine Pro uses auto-sensing technology to deliver precise, evenly distributed injections of hyaluronic acid directly into the dermis. This improves skin hydration, stimulates collagen production, and promotes a natural, healthy glow — all with minimal discomfort.",
          ],
        },
        {
          heading: "Painless Application",
          paragraphs: [
            "Featuring ultra-fine 32G–34G microneedles and a multi-needle cartridge that reduces injection pain significantly.",
          ],
        },
        {
          heading: "Advanced Vacuum Technology",
          paragraphs: [
            "The built-in vacuum stabilizes the skin and ensures perfect contact, minimizing bruising and reducing product leakage.",
          ],
        },
        {
          heading: "Safe & Effective Delivery",
          paragraphs: [
            "Ensures the booster is delivered to the correct layer of the skin, maximizing efficacy and results.",
          ],
        },
        {
          heading: "Fast Recovery",
          paragraphs: [
            "Expect quicker healing times with less swelling and minimal risk of bruising. Now you can enjoy a Healthy Look Painless Skin Booster — upgraded to the latest technology at no additional cost.",
          ],
        },
      ],
    },
  ],

  "salmon-dna": [
    {
      title: "Salmon DNA Treatment in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "While you can't press the rewind button on your skin, you can achieve a more youthful look with a bio-stimulating procedure using salmon DNA. Salmon DNA Treatment helps repair damaged skin, reduce visible signs of aging, decrease inflammation, and improve overall skin quality. It contains a Polynucleotide (PN) substance extracted from salmon DNA that is highly biocompatible with human tissue, helping stimulate cell regeneration, collagen production, and the skin's natural regenerative capability.",
            "As one of the most popular regenerative aesthetic treatments in Korea, salmon DNA injections are commonly used to improve skin texture, elasticity, hydration, and overall skin health. You may wonder if the benefits are similar to HA-based skin boosters. Instead of simply providing hydration, salmon DNA treatments work more like providing biological building blocks that support cellular repair and long-term skin rejuvenation. This treatment focuses on improving skin quality from within rather than adding volume or altering facial contours.",
          ],
        },
      ],
    },
  ],

  "exosome": [
    {
      title: "Unlock the Power of Stem Cell Exosome in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "Unlock the Fountain of Youth with Exosome in Ubud at Healthy Look Aesthetic Center in Ubud, where 60 years of stem cell research has culminated in the Exosome therapy. Unveil the secrets of cellular rejuvenation and experience the unparalleled benefits of our advanced skincare technology. Delve into the science of exosomes, nano-sized endoplasmic reticulum secreted by cells for inter-cell signal delivery. Serving as the \"avatar\" of the cell, stem cell exosomes play a pivotal role in the Paracrine effect, offering unparalleled regenerative abilities for lasting results in skin rejuvenation. The exosome is extracted from human Adipocyte Conditioned Media Extract with the regenerative properties of rose stem cell exosome.",
            "Exosome is not just an ordinary skin booster; it's a powerhouse of 1,008 growth factors and proteins. Among them, 200 have proven efficacy in skin rejuvenation, offering a comprehensive approach to address various skin concerns and promote a radiant, youthful complexion. Beside exosome, ExoSCRT is also packed with essential components for skin health, including 5 growth factors, 6 peptides, 19 amino acids, 4 coenzymes, vitamins, minerals, and glutathione. This comprehensive blend nurtures your skin from within, addressing a spectrum of concerns for a holistic rejuvenation experience.",
          ],
        },
      ],
    },
  ],

  "chemical-peel": [
    {
      title: "Chemical Peels in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "Life's stresses can take a toll on your skin, leaving it lackluster and fatigued. Elevate your skincare routine and unlock a fresher, healthier glow with chemical peels at Healthy Look Aesthetic Center Ubud. Our high-end chemical peels is designed to invigorate your skin's natural renewal process. As we age, this turnover slows, resulting in uneven texture and tone. Chemical peels gently exfoliate the outer layers of skin, diminishing imperfections and unveiling a smoother, more youthful complexion. At our Aesthetic center in Ubud, we boast a diverse array of world-class peels, each targeting specific concerns with precision. We also provide unique novel peels that don't cause photosensitivity, with minimum to no downtime, making them ideal for your holiday in Bali",
            "Our certified doctors offer personalized consultations to tailor a treatment plan to your unique needs. Our chemical peels address a myriad of skin conditions, not limited to the face but also extending to the neck, décolleté, legs, armpits, arms, and buttocks.",
          ],
        },
      ],
      points: [
        "Acne & blemishes",
        "Sun damage",
        "Superficial acne scar",
        "Superficial pigmentation (freckles, lentigo)",
        "Melasma",
        "Fine lines and aging",
      ],
    },
  ],

  "muscle-sculpting": [
    {
      title: "Body Sculpting in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "Do you face difficulties in building muscle? Have you just lost weight but your body has become loose & saggy? Do you want to tighten your body without any downtime? Body Sculpting treatment might be suitable for you. Body Sculpting or also known as Muscle Sculpting, is a minimally invasive or non-surgical treatment used to improve the appearance of particular body parts by shaping and toning them. CM Slim is a next-generation HI-EMT (High-Intensity Electromagnetic Muscle Training) medical device targeted to increase body muscle development and decrease localized fat deposits in the abdomen, buttocks, thighs, and biceps, without discomfort or downtime. It is a revolutionary technology that is used worldwide to stimulate the body muscle, providing the most intensive continuous contractions for ideal muscle growth. CMSLIM is a painless and safe treatment that can produce up to 30,000 squats or crunches in 30 minutes without downtime.",
            "While the similar technology only has one function, CM Slim is a cutting-edge treatment that has a dual function, builds an average of 18% body muscle mass, and reduces an average of 21% fat. These two processes make CM Slim become the favorite treatment around the world for achieving a slimmer, more toned body, as well as increasing strength. CM slim offers a unique dual paddle application featuring a 7 Tesla, the highest in the market. HI-EMT delivers high-intensity focused electromagnetic energy to be able to bypass skin, and fat to target muscle groups. Besides increasing muscle tone and endurance, the contractions also trigger the release of free fatty acids which break down localized fat deposits via cell apoptosis.",
          ],
        },
      ],
    },
  ],

  "pelvic-floor-strengthening": [
    {
      title: "Pelvic Floor Strengthening in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "HIPEX (High-Intensity Pelvic Exercise) is beneficial in increasing and strengthening pelvic floor muscles. The pelvic floor has an important role to support the bladder and bowel function, as well as the vagina and penis. Strong pelvic floor muscles can help with urinary incontinence, increase sexual sensation, enhance more enjoyable orgasms, and reduce the symptoms of erectile dysfunction. Women or men with bladder control problems can experience physical and mental discomfort that leads to poor quality of life. They are strongly related to urological infection, skin irritation, anxiety, and even depression.",
            "The electromagnetic frequencies of the HIPEX maintain a contracted state and utilize 100% of the pelvic muscle ability, 100% of the time, which significantly increases the physiological workload required for muscle strength and growth. A session of 30-minute treatment is the equivalent of 30,000 pelvic floor contractions. During the treatment, you still remain fully clothed and just sit on the chair.",
          ],
        },
      ],
    },
    {
      title: "The Benefit of HIPEX in Bali",
      points: [
        "Non Invasive",
        "No Surgery",
        "No Downtime",
        "For both men & women regardless of your age",
        "Remain Fully Clothed",
      ],
    },
  ],

  "ipl-hair-removal": [
    {
      title: "Hair Removal in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "Have you been struggling with unwanted body hair? Do you know that regular shaving and plucking can cause irritation and hyperpigmentation? Are you tired of painful waxing and experiencing ingrown hair afterward? With IPL hair removal in Ubud, you don't have to worry about any red bumps & and ingrown hair being left behind. Thanks to the latest generation of IPL that can provide a more effective and gentler hair removal method while rejuvenating the skin at the same time. Intense Pulsed Light (IPL) uses filtered non-coherent light to selectively destroy hair roots in a process called Selective Photothermolysis.",
          ],
        },
      ],
    },
    {
      title: "What areas can be treated by IPL Hair Removal in Ubud?",
      blocks: [
        {
          paragraphs: [
            "IPL hair removal can help to reduce the unwanted hair anywhere in your body as you wish",
          ],
        },
      ],
      points: [
        "Facial hair",
        "Underarm hair",
        "Leg hair",
        "Arm hair",
        "Chest",
        "Back hair",
        "Buttock/Buttock cleft hair",
        "Bikini line hair",
        "Brazilian",
      ],
    },
  ],

  "slimming-body-contouring": [
    // The "Holistic Slimming & Body Contouring in Ubud" opener is this
    // treatment's `intro`, so it leads the page and is not repeated here.
    {
      title: "Holistic Slimming Approach in Ubud",
      blocks: [
        {
          heading: "Personalized Nutrition Approach with Nutrigenomic",
          paragraphs: [
            "Begin your journey to a healthier, and slimmer you with our Personalized Nutrition Approach grounded in Nutrigenomic science. Unveil the unique relationship between your genetics and nutrition, allowing us to craft an individualized plan tailored to your body's needs. Enjoy personalised guidance from a Certified Anti-Aging Doctor to ensure not just weight loss, but a holistic improvement in well-being.",
          ],
        },
        {
          heading: "Muscle Sculpting by CM Slim",
          paragraphs: [
            "Our CE Certified CM Slim machine introduces a revolutionary approach to body sculpting. Utilizing High-Intensity Electromagnetic Muscle Trainer technology, CM Slim allows you to burn fat and build muscle simultaneously. For those seeking body contouring in Ubud, this advanced non-invasive modalitiy provides a safe and effective solution without any downtime. What's even better, the procedure is painless without any needle involved.",
          ],
        },
        {
          heading: "Premium Fat Dissolving Injections",
          paragraphs: [
            "Experience targeted fat reduction with our premium Fat Dissolving Injections. Setting a new standard in painless injections, we offer antioxidant-infused products for a more comfortable experience compared to general market options. When searching for effective solutions for stubborn fat, Healthy Look Aesthetic Center in Ubud is your go-to destination in Ubud.",
          ],
        },
        {
          heading: "Slimming Infusion for Metabolic Boost",
          paragraphs: [
            "Nourish your body from within with our Slimming Infusion, a potent blend of multivitamins and antioxidants. Designed to boost metabolism and support muscle growth, this infusion is a key component of our holistic approach to slimming in Ubud",
          ],
        },
        {
          heading: "Lymphatic Drainage Massage",
          paragraphs: [
            "Eliminate the excess water in your body and promote a balanced system with our Signature Lymphatic Drainage Massage. This relaxing and rhythmic massage aims to stimulate the lymphatic vessels, promoting the efficient removal of toxins, excess fluid, and waste from the body. By facilitating lymphatic flow, this treatment helps reduce swelling, supports immune function, and promotes an overall sense of well-being. When searching for lymphatic drainage in Ubud, our aesthetic center offers expert care for vitality.",
          ],
        },
        {
          heading: "Radiofrequency for Skin Tightening?",
          paragraphs: [
            "Conclude your slimming journey with Radiofrequency technology, tightening loose skin for a rejuvenated appearance. For those in Ubud searching for effective solutions for loose skin, our Radiofrequency treatments provide a non-invasive and painless option.",
            "As you search for slimming and body contouring in Ubud, Healthy Look Aesthetic Center in Ubud invites you to experience the pinnacle of evidence-based wellness. Discover a holistic approach that combines advanced modalities with personalized care, unlocking a revitalized, sculpted, and radiant version of yourself.",
          ],
        },
      ],
    },
  ],

  // Keyed by slug like every other entry, even though this treatment's page
  // is served from /eye-rejuvenaton-treatment rather than /ubud-bali/. The
  // URL is a routing concern; the lookup key stays the slug.
  //
  // The opening paragraph is this treatment's `intro`, so it is not repeated
  // here. The live page numbers its four concerns "1." to "4."; the numbers
  // are dropped because the section renders them as headings in order and a
  // hard-coded "3." would be wrong the moment one is added or reordered.
  "eye-rejuvenation": [
    {
      title: "Dark Circles & Fine Lines",
      blocks: [
        {
          paragraphs: [
            "Struggling with fine lines and dark circles around your eyes? At Healthy Look Aesthetic, we offer a range of personalized treatments tailored to address your specific concerns. Understanding the Causes of Dark circles can be diverse ranging from various factors, including pigmentation, increased vascularity, volume loss, anatomy, laxity, or overactive muscles, along with medical conditions like eczema, hay fever, or allergies.",
            "Our approach begins with a thorough assessment to determine the underlying cause before employing personalized treatments, such as:",
          ],
        },
        {
          heading: "Personalized Mesotherapy",
          paragraphs: [
            "Our mesotherapy treatments are specially formulated with a blend of hyaluronic acid, vitamins, antioxidants, and peptides to hydrate, nourish, and revitalize your skin from within.",
          ],
        },
        {
          heading: "Salmon DNA Injection",
          paragraphs: [
            "Targeted specifically for the under-eye area, our salmon DNA injections utilize premium brands containing polynucleotide, a more purified form compared to PDRN like Rejuran I, ensuring superior results in enhancing firmness and elasticity.",
          ],
        },
        {
          heading: "Chemical Peels",
          paragraphs: [
            "Rejuvenate your eye area with our chemical peels, which effectively remove dead skin cells, promote cell turnover, and improve skin texture and tone for a brighter, more youthful appearance.",
          ],
        },
        {
          heading: "Sylfirm X",
          paragraphs: [
            "This advanced FDA Approved RF Microneedling will stimulate collagen production and trigger your body's natural healing process with microneedling. The additional heat and energy delivered by RF-powered microneedles will also help to tighten the skin",
            "Do eye creams help with dark circles? While eye creams can be beneficial, their effectiveness varies depending on the individual and can be integrated into anti-aging prevention routines or targeted rejuvenation approaches.",
          ],
        },
      ],
    },
    {
      title: "Dynamic Wrinkles",
      blocks: [
        {
          paragraphs: [
            "When it comes to addressing dynamic wrinkles, like crow's feet around the eyes, Botox emerges as the go-to solution. Botox works by relaxing facial muscles, effectively reducing muscle contractions by temporarily blocking nerve impulses. Our highly-targeted injections yield natural-looking results, specifically targeting wrinkles around the eyes. Quick and efficient, these injections take less than 5 minutes to administer and typically offer results lasting between 3 to 6 months. The primary function of Botox is to prevent dynamic wrinkles from progressing into static wrinkles, ensuring a smoother and more youthful appearance. At Healthy Look Aesthetic, we utilize premium Botox products from trusted brands like Allergan, as well as Korean Botox Botulax, providing an affordable alternative without compromising on quality.",
          ],
        },
      ],
    },
    {
      title: "Droopy Eyelid",
      blocks: [
        {
          paragraphs: [
            "Looking to combat droopy eyelids? Look no further than HIFU treatment at our aesthetic center in Ubud. This non-invasive cosmetic procedure utilizes ultrasound waves to lift and tighten the skin around the eyes, targeting sagging skin and restoring firmness. HIFU treatment works by delivering focused ultrasound energy to the deeper layers of the skin, stimulating collagen production and enhancing skin tightness. This results in a reduction of sagging skin around the eye area, providing a natural brow lift effect and overall rejuvenating appearance.",
          ],
        },
      ],
    },
    {
      title: "Under Eye Hollow",
      blocks: [
        {
          paragraphs: [
            "As we age, there is a natural decrease in collagen and fat in the eyelid skin, leading to hollowing and the appearance of shadows, and tear troughs. To combat this, we offer under-eye filler treatments in Ubud using premium products like Juvederm and Teosyal. These fillers, made from hyaluronic acid, are injected to replace lost volume and smooth lines and wrinkles, providing immediate results that can last up to 9-12 months.",
            "Wondering how much filler is needed for under-eye treatment? The volume required is typically very small, ranging from 0.3 to 0.5 ml per eye. We emphasize a \"less-is-more\" approach to filler to ensure a natural and youthful look. Generally, one ml of filler is sufficient to restore lost volume in the under-eye. In some cases, cheek fillers may also be recommended to support the under-eye area depending on individual anatomy and age-related volume loss.",
            "With all modalities, it might be confusing to choose the best treatment for you. Hence, we offer a complimentary consultation session with our Certified Aesthetic & Anti-Aging Doctor at Healthy Look Aesthetic in Ubud. During this session, our doctor will carefully analyze your concerns and recommend the most suitable treatment tailored to your needs. Ready to discover the best eye rejuvenation solution for you? Book your consultation session today and take the first step towards achieving your aesthetic goals with Healthy Look Aesthetic in Ubud",
          ],
        },
      ],
    },
  ],

  "hair-mesotherapy": [
    {
      title: "Hair Mesotherapy in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "Mesotherapy aims to provide essential nutrients like vitamins and antioxidants to improve blood flow for hair growth in both men & women. It helps to treat the early stage of alopecia and hair thinning problems. The serum used is a personalized cocktail according to the type of alopecia, age, and severity of the condition. Mesotherapy utilizes the multi-needle method or manual injection using a tiny needle to allow 90% penetration of active ingredients into the follicle rather than topical products.",
          ],
        },
      ],
    },
  ],

  "iv-drip": [
    {
      title: "IV Drip in Ubud Bali",
      blocks: [
        {
          paragraphs: [
            "Boost Your Wellness with IV Drip Therapy in Ubud. Looking to recharge your energy levels, enhance skin glow, or recover swiftly from Bali belly? Dive into the IV drip therapy at Healthy Look Aesthetic in Ubud. Our IV drip treatments in Ubud are designed to help restore hydration, improve vitamin absorption, and support overall wellness by delivering essential vitamins, minerals, and antioxidants directly into your bloodstream for optimal results.",
            "IV drip (intravenous therapy) is widely used in Bali for dehydration, fatigue, jet lag, hangover recovery, and Bali belly. Compared to oral supplements, IV drip in Bali offers faster absorption because nutrients are delivered directly into the bloodstream, allowing the body to respond more efficiently. Administered by our skilled registered nurses in a secure setting, our IV drip therapy boasts an impressive absorption rate of 99%, surpassing oral intake by miles (typically only 20-30%). This means your body gets the vital nutrients it craves quickly and effectively, leaving you refreshed and revitalized.",
            "Your journey with us commences with a personalized consultation to evaluate your medical history, suitability for IV drip therapy, and blood pressure check. Upon approval, a small cannula is delicately inserted into your vein to begin the IV drip infusion process. Treatment durations typically range from 30 to 60 minutes, depending on the selected IV drip formula and individual needs. After your session, we recommend maintaining hydration levels by consuming plenty of water. Trust Healthy Look Aesthetic for top-tier IV therapy in Ubud, where wellness and vitality are just a drip away.",
          ],
        },
      ],
    },
    {
      // Prices deliberately dropped from these headings — see the note at the
      // top of this block. The live page prints them here; this file keeps
      // them only in the treatment's priceGroups.
      title: "IV Booster in Ubud Bali",
      blocks: [
        {
          heading: "Immune Booster",
          paragraphs: [
            "Elevate your well-being with an immune booster IV drip, rich in potent doses of vitamin C, B complex, and a blend of essential vitamins A, D, and E. This powerful infusion delivers a surge of nutrients, reducing infection risk & minimizing the disease's severity.",
          ],
        },
        {
          heading: "Jet Lag Recovery",
          paragraphs: [
            "Experience rapid recovery with our IV drip, featuring rehydration solution, high doses of vitamin C, B complex, along with essential vitamins. Restore your body's balance, and replenish energy levels, ensuring you feel refreshed to kickstart your holiday",
          ],
        },
        {
          heading: "Ultimate Glow",
          paragraphs: [
            "Uncover the Ultimate Glow IV Drip, boasting potent doses of vitamin C, glutathione, and alpha-lipoic acid. Globally recognized for its efficacy in promoting healthy skin through powerful antioxidants, this infusion rejuvenates skin radiance and enhances elasticity",
          ],
        },
        {
          heading: "Anti Aging",
          paragraphs: [
            "Introducing our Anti-Aging blend, fortified with vitamin C, B complex, A, D, E, multi minerals, and premium glutathione. This powerhouse infusion combats oxidative stress, a primary cause of premature aging, to restore youthful vitality.",
          ],
        },
        {
          heading: "Myer's Cocktail",
          paragraphs: [
            "Experience the comprehensive blend of vitamin C, vitamin B complex, multivitamins, alongside with minerals, this infusion supports antioxidant activity, improves the skin issues to boosting general wellness",
          ],
        },
      ],
    },
  ],
};

export function getSections(slug: string): TreatmentSection[] {
  return treatmentSections[slug] ?? [];
}
