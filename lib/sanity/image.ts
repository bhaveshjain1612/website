import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source).auto("format").fit("max");
}
