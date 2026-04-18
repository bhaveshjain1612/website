import { ContactPage } from "@/components/contact-page";
import { getSiteContent } from "@/lib/content";

export const metadata = {
  title: "Contact"
};

export default async function Page() {
  const content = await getSiteContent();
  return <ContactPage settings={content.settings} />;
}
