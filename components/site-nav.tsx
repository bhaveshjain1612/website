"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useAccessibility } from "@/components/accessibility-provider";
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
  const {
    fontScale,
    reduceMotion,
    highContrast,
    increaseFontScale,
    decreaseFontScale,
    toggleReduceMotion,
    toggleHighContrast,
    resetAccessibility
  } = useAccessibility();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setA11yOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!a11yOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setA11yOpen(false);
      }
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (!panelRef.current) {
        return;
      }
      if (!panelRef.current.contains(event.target as Node)) {
        setA11yOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handleOutsideClick);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [a11yOpen]);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <Image src="/logo-mark.svg" alt="" width={22} height={22} aria-hidden />
            <span className="logo-text">
              Bhavesh <span>Jain</span>
            </span>
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
            <div className="a11y-wrap" ref={panelRef}>
              <button
                type="button"
                className={`nav-btn ${a11yOpen ? "active" : ""}`}
                onClick={() => setA11yOpen((current) => !current)}
                aria-label="Accessibility Settings"
                aria-expanded={a11yOpen}
                aria-controls="a11y-panel"
              >
                <AccessibilityNewRoundedIcon fontSize="inherit" />
              </button>
              {a11yOpen ? (
                <div id="a11y-panel" className="a11y-panel" role="dialog" aria-label="Accessibility settings">
                  <div className="a11y-header">
                    <strong>Accessibility</strong>
                    <span>Adjust readability</span>
                  </div>
                  <div className="a11y-control">
                    <span>Text size</span>
                    <div className="a11y-stepper">
                      <button type="button" onClick={decreaseFontScale} aria-label="Decrease text size">
                        A-
                      </button>
                      <output aria-live="polite">{Math.round(fontScale * 100)}%</output>
                      <button type="button" onClick={increaseFontScale} aria-label="Increase text size">
                        A+
                      </button>
                    </div>
                  </div>
                  <div className="a11y-toggle-row">
                    <button
                      type="button"
                      className={reduceMotion ? "active" : ""}
                      onClick={toggleReduceMotion}
                      aria-pressed={reduceMotion}
                    >
                      Reduce motion
                    </button>
                    <button
                      type="button"
                      className={highContrast ? "active" : ""}
                      onClick={toggleHighContrast}
                      aria-pressed={highContrast}
                    >
                      High contrast
                    </button>
                  </div>
                  <button type="button" className="a11y-reset" onClick={resetAccessibility}>
                    Reset
                  </button>
                </div>
              ) : null}
            </div>
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
