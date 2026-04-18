export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";
export const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
export const sanityStudioBasePath = "/studio";
export const sanityReadToken = process.env.SANITY_READ_TOKEN ?? process.env.SANITY_WRITE_TOKEN ?? "";

export const isSanityConfigured = Boolean(sanityProjectId && sanityDataset);
