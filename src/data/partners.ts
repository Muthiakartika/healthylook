// The product and device brands the clinic works with, as shown on the
// live site's partner strip — now with the real logo files, pulled from
// the client's own media library.
//
// These are factual, verifiable brand names and the clinic's own uploaded
// assets. They earn a section because a list of recognised manufacturers is
// one of the few genuine trust signals available without inventing
// statistics: it tells a prospective patient what's actually going into
// their face.

export type Partner = {
  name: string;
  logo: string;
};

export const partners: Partner[] = [
  { name: "Restylane", logo: "/images/partners/restylane.webp" },
  { name: "Rejuran", logo: "/images/partners/rejuran.webp" },
  { name: "Profhilo", logo: "/images/partners/profhilo.webp" },
  { name: "Nucleofill", logo: "/images/partners/nucleofill.webp" },
  { name: "NeoStrata", logo: "/images/partners/neostrata.webp" },
  { name: "Juvederm", logo: "/images/partners/juvederm.webp" },
  { name: "Botox", logo: "/images/partners/botox.webp" },
  { name: "CM Slim", logo: "/images/partners/cmslim.webp" },
  { name: "Dermalogica", logo: "/images/partners/dermalogica.webp" },
  { name: "Dermapen", logo: "/images/partners/dermapen.webp" },
  { name: "Fillmed", logo: "/images/partners/fillmed.webp" },
  { name: "Teosyal", logo: "/images/partners/teosyal.webp" },
  { name: "Gouri", logo: "/images/partners/gouri.webp" },
  { name: "Sylfirm X", logo: "/images/partners/sylfirm.webp" },
  { name: "Juvelook", logo: "/images/partners/juvelook.jpg" },
  { name: "Linear Z", logo: "/images/partners/linearz.jpg" },
  { name: "Casmara", logo: "/images/partners/casmara.jpg" },
];
