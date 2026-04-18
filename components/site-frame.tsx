"use client";

import { useEffect, useState } from "react";
import { SearchOverlay } from "@/components/search-overlay";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useTheme } from "@/components/theme-provider";
import { type SearchItem, type SiteSettings } from "@/lib/site-data";

type SiteFrameProps = {
  children: React.ReactNode;
  searchItems: SearchItem[];
  settings: SiteSettings;
};

export function SiteFrame({ children, searchItems, settings }: SiteFrameProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme } = useTheme();

  const textureOverlay =
    theme === "light" ? settings.textureOverlayLight : settings.textureOverlayDark;

  useEffect(() => {
    const root = document.documentElement;
    if (textureOverlay) {
      root.style.setProperty("--user-texture-image", `url("${textureOverlay}")`);
    } else {
      root.style.removeProperty("--user-texture-image");
    }
  }, [textureOverlay]);

  return (
    <div className="site-root">
      <SiteNav onSearch={() => setSearchOpen(true)} />
      <main className="page-main">{children}</main>
      <SiteFooter
        contactEmail={settings.contactEmail}
        newsletterEndpoint={settings.newsletterEndpoint}
      />
      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} items={searchItems} /> : null}
    </div>
  );
}
