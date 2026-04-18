"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AccessibilityContextValue = {
  fontScale: number;
  reduceMotion: boolean;
  highContrast: boolean;
  increaseFontScale: () => void;
  decreaseFontScale: () => void;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  resetAccessibility: () => void;
};

type AccessibilityPrefs = {
  fontScale: number;
  reduceMotion: boolean;
  highContrast: boolean;
};

const STORAGE_KEY = "bhavesh-accessibility";
const DEFAULT_PREFS: AccessibilityPrefs = {
  fontScale: 1,
  reduceMotion: false,
  highContrast: false
};

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

function clampFontScale(value: number): number {
  return Math.min(1.25, Math.max(0.9, Number(value.toFixed(2))));
}

function applyPrefs(prefs: AccessibilityPrefs): void {
  const root = document.documentElement;
  root.style.setProperty("--a11y-font-scale", String(clampFontScale(prefs.fontScale)));
  root.classList.toggle("a11y-reduce-motion", prefs.reduceMotion);
  root.classList.toggle("a11y-high-contrast", prefs.highContrast);
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      applyPrefs(DEFAULT_PREFS);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<AccessibilityPrefs>;
      const nextPrefs: AccessibilityPrefs = {
        fontScale: clampFontScale(parsed.fontScale ?? DEFAULT_PREFS.fontScale),
        reduceMotion: Boolean(parsed.reduceMotion),
        highContrast: Boolean(parsed.highContrast)
      };
      setPrefs(nextPrefs);
      applyPrefs(nextPrefs);
    } catch {
      applyPrefs(DEFAULT_PREFS);
    }
  }, []);

  useEffect(() => {
    applyPrefs(prefs);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      fontScale: prefs.fontScale,
      reduceMotion: prefs.reduceMotion,
      highContrast: prefs.highContrast,
      increaseFontScale: () =>
        setPrefs((current) => ({
          ...current,
          fontScale: clampFontScale(current.fontScale + 0.05)
        })),
      decreaseFontScale: () =>
        setPrefs((current) => ({
          ...current,
          fontScale: clampFontScale(current.fontScale - 0.05)
        })),
      toggleReduceMotion: () =>
        setPrefs((current) => ({
          ...current,
          reduceMotion: !current.reduceMotion
        })),
      toggleHighContrast: () =>
        setPrefs((current) => ({
          ...current,
          highContrast: !current.highContrast
        })),
      resetAccessibility: () => setPrefs(DEFAULT_PREFS)
    }),
    [prefs]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used inside AccessibilityProvider.");
  }
  return context;
}

