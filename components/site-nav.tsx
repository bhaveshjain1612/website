"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useFontCombo } from "@/components/font-combo-provider";
import { useTheme } from "@/components/theme-provider";

type SiteNavProps = {
  onSearch: () => void;
};

const LINKS = [
  { label: "Building", href: "/building" },
  { label: "Living", href: "/living" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export function SiteNav({ onSearch }: SiteNavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { combo, cycleCombo } = useFontCombo();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            Bhavesh <span>Jain</span>
          </Link>
          <div className="nav-right">
            <nav className="nav-links">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={pathname === link.href || pathname.startsWith(`${link.href}/`) ? "active" : ""}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button type="button" className="nav-btn" onClick={onSearch} aria-label="Search">
              <SearchRoundedIcon fontSize="inherit" />
            </button>
            <button
              type="button"
              className="nav-btn"
              onClick={cycleCombo}
              aria-label="Cycle Font Combination"
              title={combo.label}
            >
              <TextFieldsRoundedIcon fontSize="inherit" />
            </button>
            <button
              type="button"
              className="nav-btn"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <LightModeRoundedIcon fontSize="inherit" />
              ) : (
                <DarkModeRoundedIcon fontSize="inherit" />
              )}
            </button>
            <button
              type="button"
              className="menu-btn"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle Menu"
            >
              {mobileOpen ? (
                <CloseRoundedIcon fontSize="inherit" />
              ) : (
                <MenuRoundedIcon fontSize="inherit" />
              )}
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <Link href="/">Home</Link>
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}
