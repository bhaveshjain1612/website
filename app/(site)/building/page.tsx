import { BuildingPage } from "@/components/building-page";
import { getSiteContent } from "@/lib/content";

export default async function Page() {
  const content = await getSiteContent();
  return <BuildingPage content={content} />;
}
