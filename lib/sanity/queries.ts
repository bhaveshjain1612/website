import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    bio,
    "heroImages": heroImages[].asset->url,
    quotes,
    contactEmail,
    contactFormEndpoint,
    newsletterEndpoint,
    "textureOverlayLight": textureOverlayLight.asset->url,
    "textureOverlayDark": textureOverlayDark.asset->url,
    socialLinks[]{
      platform,
      url,
      icon
    }
  }
`;

export const nowItemsQuery = groq`
  *[_type == "nowItem"] | order(order asc){
    label,
    value
  }
`;

export const blogsQuery = groq`
  *[_type == "blogPost"] | order(date desc){
    title,
    "slug": slug.current,
    "date": coalesce(date, _updatedAt),
    "cat": category,
    "ex": excerpt,
    body,
    tags,
    "coverImage": coverImage.asset->url
  }
`;

export const blogBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    "date": coalesce(date, _updatedAt),
    "cat": category,
    "ex": excerpt,
    body,
    tags,
    "coverImage": coverImage.asset->url
  }
`;

export const galleriesQuery = groq`
  *[_type == "gallery"] | order(date desc){
    title,
    "slug": slug.current,
    location,
    "date": coalesce(date, _updatedAt),
    "desc": description,
    tags,
    lightroomShareUrl,
    "cover": coverImage.asset->url,
    "photos": images[]{
      "url": asset->url,
      caption
    }
  }
`;

export const galleryBySlugQuery = groq`
  *[_type == "gallery" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    location,
    "date": coalesce(date, _updatedAt),
    "desc": description,
    tags,
    lightroomShareUrl,
    "cover": coverImage.asset->url,
    "photos": images[]{
      "url": asset->url,
      caption
    }
  }
`;

export const educationQuery = groq`
  *[_type == "education"] | order(order asc){
    school,
    "deg": degree,
    "sub": subtitle,
    "when": period,
    gpa,
    courses
  }
`;

export const experienceQuery = groq`
  *[_type == "experience"] | order(order asc){
    "co": company,
    role,
    "when": period,
    "where": location,
    "hl": highlights,
    priority
  }
`;

export const projectQuery = groq`
  *[_type == "project" && slug.current == "stockspektra"][0]{
    title,
    subtitle,
    description,
    techStack,
    "stats": stats[]{
      "l": label,
      "v": value
    }
  }
`;
