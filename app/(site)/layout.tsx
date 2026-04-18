import { SiteFrame } from "@/components/site-frame";
import { getSiteContent } from "@/lib/content";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getSiteContent();
  return (
    <SiteFrame searchItems={content.searchItems} settings={content.settings}>
      {children}
    </SiteFrame>
  );
}
