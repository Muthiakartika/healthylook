import { defineQuery } from "next-sanity";

const imageProjection = `{
  _type,
  asset,
  alt,
  caption,
  crop,
  hotspot
}`;

const seoProjection = `{
  title,
  description,
  image ${imageProjection},
  noIndex
}`;

const sectionProjection = `{
  ...,
  image ${imageProjection},
  images[] ${imageProjection},
  items[]{
    ...,
    image ${imageProjection}
  }
}`;

export const pageByPathQuery = defineQuery(`
  *[_type == "page" && path == $path][0]{
    _id,
    _type,
    title,
    path,
    seo ${seoProjection},
    sections[] ${sectionProjection}
  }
`);

export const allPagePathsQuery = defineQuery(`
  *[_type == "page" && defined(path)].path
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    coverImage ${imageProjection},
    publishedAt,
    "categories": categories[]->{_id, title, "slug": slug.current},
    body,
    seo ${seoProjection}
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc){
    _id,
    _type,
    title,
    "slug": slug.current,
    excerpt,
    coverImage ${imageProjection},
    publishedAt,
    "categories": categories[]->{_id, title, "slug": slug.current},
    body,
    seo ${seoProjection}
  }
`);

export const allPostSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`);

export const allTreatmentsQuery = defineQuery(`
  *[_type == "treatment" && defined(slug.current)] | order(name asc){
    ...,
    "slug": slug.current,
    image ${imageProjection},
    seo ${seoProjection}
  }
`);

export const allPricingSectionsQuery = defineQuery(`
  *[_type == "pricingSection"] | order(order asc, title asc){
    _id,
    _type,
    title,
    category,
    order,
    groups
  }
`);

export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0]{
    ...,
    defaultSeo ${seoProjection}
  }
`);

export const allPartnersQuery = defineQuery(`
  *[_type == "partner"] | order(order asc, name asc){
    _id,
    _type,
    name,
    order,
    logo ${imageProjection}
  }
`);

export const allDoctorsQuery = defineQuery(`
  *[_type == "doctor"] | order(order asc, name asc){
    _id,
    _type,
    name,
    shortName,
    title,
    bio,
    registrationNumber,
    registryUrl,
    order,
    photo ${imageProjection}
  }
`);

export const allTestimonialsQuery = defineQuery(`
  *[_type == "testimonial"] | order(order asc, name asc){
    _id,
    _type,
    name,
    quote,
    source,
    featured,
    order,
    "treatmentSlugs": treatments[]->slug.current
  }
`);
