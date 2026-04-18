import { GalleryPage } from "@/components/gallery-page";
import { getSiteContent } from "@/lib/content";

export default async function Page() {
  const content = await getSiteContent();
  return <GalleryPage content={content} />;
}
