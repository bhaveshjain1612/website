import { LivingPage } from "@/components/living-page";
import { getSiteContent } from "@/lib/content";

export default async function Page() {
  const content = await getSiteContent();
  return <LivingPage content={content} />;
}
