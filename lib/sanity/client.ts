import "server-only";
import { createClient } from "next-sanity";
import { sanityApiVersion, sanityDataset, sanityProjectId, sanityReadToken } from "@/lib/sanity/env";

export const sanityClient = createClient({
  projectId: sanityProjectId || "missing-project-id",
  dataset: sanityDataset || "production",
  apiVersion: sanityApiVersion,
  token: sanityReadToken || undefined,
  useCdn: !sanityReadToken,
  perspective: "published"
});
