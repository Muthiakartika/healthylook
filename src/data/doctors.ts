// The clinic's two doctors, shown on the homepage and again in full on
// /our-doctor.
//
// ── SOURCE ─────────────────────────────────────────────────────────────
// Every sentence below is taken verbatim from healthylook-aesthetic.com's
// own /our-doctor page. The previous version of this file paraphrased
// their credentials into freshly-written copy, and got Dr. Jessika's name
// wrong (it had "Dr. Jess", which is how she's referred to informally, not
// her full name). Both are fixed here — on a medical site a doctor's name
// and qualifications are the last thing that should be reworded.

export type Doctor = {
  id: string;
  name: string;
  /** Informal short form, used in CTAs. */
  shortName: string;
  title: string;
  /** Each entry is one verbatim paragraph from the live site. */
  bio: string[];
  photo: string;
};

export const doctors: Doctor[] = [
  {
    id: "dr-irene-sienatra",
    name: "Dr. Irene Sienatra, M.Biomed AAM",
    shortName: "Dr. Irene",
    title: "Head Doctor",
    bio: [
      "Dr. Irene is an internationally trained aesthetic doctor with 7+ years of experience in injectable and energy-based treatments.",
      "She earned her Bachelor of Medicine degree with cum laude honors from Airlangga University, one of Indonesia's most prestigious medical faculties.",
      "She pursued a master's degree in Anti-Aging Medicine, graduating once again with cum laude honors.",
      "Dr. Irene is known for her perfectionism when performing the treatment to her patients. She is extremely selective in choosing the best products for her patients.",
    ],
    photo: "/images/doctors/doctor-01.jpg",
  },
  {
    id: "dr-jessika-sobaevana",
    name: "Dr. Jessika Sobaevana",
    shortName: "Dr. Jess",
    title: "Aesthetic Doctor",
    bio: [
      "Dr. Jess is a dedicated aesthetic physician with a strong passion for aesthetic medicine.",
      "She earned her medical degree from UPN Veteran Jakarta, graduating with outstanding academic achievement.",
      "Since beginning her aesthetic career in 2021, she has developed extensive experience in a wide range of procedures, including injectables, thread lifts, and energy-based device treatments.",
    ],
    photo: "/images/doctors/doctor-02.jpg",
  },
];
