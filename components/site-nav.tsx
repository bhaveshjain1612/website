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
import { trackEvent } from "@/lib/analytics";

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
    if (!a11yOpen || mobileOpen) {
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
  }, [a11yOpen, mobileOpen]);

  const toggleMobileMenu = () => {
    setMobileOpen((open) => !open);
    setA11yOpen(false);
  };

  const openSearchFromDesktop = () => {
    trackEvent("search_open", { source: "desktop" });
    onSearch();
  };

  const openSearchFromMenu = () => {
    setMobileOpen(false);
    setA11yOpen(false);
    trackEvent("search_open", { source: "mobile" });
    onSearch();
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setA11yOpen(false);
  };

  const handleThemeToggle = () => {
    trackEvent("theme_toggle", { next_theme: theme === "dark" ? "light" : "dark" });
    toggleTheme();
  };

  const handleFontComboCycle = () => {
    trackEvent("font_combo_cycle", { current_combo: combo.id });
    cycleCombo();
  };

  const handleReduceMotionToggle = () => {
    trackEvent("a11y_reduce_motion_toggle", { enabled: !reduceMotion });
    toggleReduceMotion();
  };

  const handleHighContrastToggle = () => {
    trackEvent("a11y_high_contrast_toggle", { enabled: !highContrast });
    toggleHighContrast();
  };

  const handleA11yReset = () => {
    trackEvent("a11y_reset");
    resetAccessibility();
  };

  const renderA11yPanel = (panelId: string, panelClassName?: string) => (
    <div
      id={panelId}
      className={panelClassName ? `a11y-panel ${panelClassName}` : "a11y-panel"}
      role="dialog"
      aria-label="Accessibility settings"
    >
      <div className="a11y-header">
        <strong>Accessibility</strong>
        <span>Adjust readability and visual preferences</span>
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
      <div className="a11y-control">
        <span>Theme</span>
        <button type="button" className="a11y-chip" onClick={handleThemeToggle}>
          {theme === "dark" ? (
            <LightModeRoundedIcon fontSize="inherit" />
          ) : (
            <DarkModeRoundedIcon fontSize="inherit" />
          )}
          <span>{theme === "dark" ? "Switch to light" : "Switch to dark"}</span>
        </button>
      </div>
      <div className="a11y-control">
        <span>Font style</span>
        <button type="button" className="a11y-chip" onClick={handleFontComboCycle} title={combo.label}>
          <TextFieldsRoundedIcon fontSize="inherit" />
          <span>{combo.label}</span>
        </button>
      </div>
      <div className="a11y-toggle-row">
        <button
          type="button"
          className={reduceMotion ? "active" : ""}
          onClick={handleReduceMotionToggle}
          aria-pressed={reduceMotion}
        >
          Reduce motion
        </button>
        <button
          type="button"
          className={highContrast ? "active" : ""}
          onClick={handleHighContrastToggle}
          aria-pressed={highContrast}
        >
          High contrast
        </button>
      </div>
      <button type="button" className="a11y-reset" onClick={handleA11yReset}>
        Reset
      </button>
    </div>
  );

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <span className="logo-badge" aria-hidden>
              <Image src="/logo-gold-512.png" alt="" width={28} height={28} />
            </span>
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
            <button
              type="button"
              className="nav-btn nav-desktop-only"
              onClick={openSearchFromDesktop}
              aria-label="Search"
            >
              <SearchRoundedIcon fontSize="inherit" />
            </button>
            <div className="a11y-wrap nav-desktop-only" ref={panelRef}>
              <button
                type="button"
                className={`nav-btn ${a11yOpen ? "active" : ""}`}
                onClick={() =>
                  setA11yOpen((current) => {
                    const next = !current;
                    if (next) {
                      trackEvent("a11y_open", { source: "desktop" });
                    }
                    return next;
                  })
                }
                aria-label="Accessibility Settings"
                aria-expanded={a11yOpen}
                aria-controls="a11y-panel-desktop"
              >
                <AccessibilityNewRoundedIcon fontSize="inherit" />
              </button>
              {a11yOpen ? renderA11yPanel("a11y-panel-desktop") : null}
            </div>
            <button
              type="button"
              className="menu-btn"
              onClick={toggleMobileMenu}
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
        <div className="mobile-menu-panel">
          <Link href="/" onClick={closeMobileMenu}>
            Home
          </Link>
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))}
          <div className="mobile-menu-tools">
            <button type="button" className="mobile-menu-action" onClick={openSearchFromMenu}>
              Search
            </button>
            <button
              type="button"
              className={`mobile-menu-action ${a11yOpen ? "active" : ""}`}
              onClick={() =>
                setA11yOpen((current) => {
                  const next = !current;
                  if (next) {
                    trackEvent("a11y_open", { source: "mobile" });
                  }
                  return next;
                })
              }
              aria-expanded={a11yOpen}
              aria-controls="a11y-panel-mobile"
            >
              Accessibility
            </button>
          </div>
          {a11yOpen ? renderA11yPanel("a11y-panel-mobile", "a11y-panel-mobile") : null}
        </div>
      </div>
    </>
  );
}
