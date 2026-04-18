"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type FontComboId =
  | "style-instrument"
  | "allura-dm"
  | "greatvibes-cormorant"
  | "dancing-playfair";

type FontCombo = {
  id: FontComboId;
  label: string;
};

type FontComboContextValue = {
  combo: FontCombo;
  combos: FontCombo[];
  cycleCombo: () => void;
};

const FONT_COMBOS: FontCombo[] = [
  { id: "style-instrument", label: "Style Script + Instrument Serif" },
  { id: "allura-dm", label: "Allura + DM Serif Display" },
  { id: "greatvibes-cormorant", label: "Great Vibes + Cormorant Garamond" },
  { id: "dancing-playfair", label: "Dancing Script + Playfair Display" }
];

const FontComboContext = createContext<FontComboContextValue | null>(null);
const STORAGE_KEY = "bhavesh-font-combo";

function applyFontClass(comboId: FontComboId): void {
  const root = document.documentElement;
  for (const combo of FONT_COMBOS) {
    root.classList.remove(`font-combo-${combo.id}`);
  }
  root.classList.add(`font-combo-${comboId}`);
}

function isFontComboId(value: string): value is FontComboId {
  return FONT_COMBOS.some((combo) => combo.id === value);
}

export function FontComboProvider({ children }: { children: React.ReactNode }) {
  const [comboId, setComboId] = useState<FontComboId>("style-instrument");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const nextComboId = saved && isFontComboId(saved) ? saved : "style-instrument";
    setComboId(nextComboId);
    applyFontClass(nextComboId);
  }, []);

  useEffect(() => {
    applyFontClass(comboId);
    window.localStorage.setItem(STORAGE_KEY, comboId);
  }, [comboId]);

  const value = useMemo<FontComboContextValue>(() => {
    const currentIndex = FONT_COMBOS.findIndex((combo) => combo.id === comboId);
    const combo = FONT_COMBOS[currentIndex] ?? FONT_COMBOS[0];
    return {
      combo,
      combos: FONT_COMBOS,
      cycleCombo: () =>
        setComboId((current) => {
          const index = FONT_COMBOS.findIndex((comboItem) => comboItem.id === current);
          const nextIndex = (index + 1) % FONT_COMBOS.length;
          return FONT_COMBOS[nextIndex].id;
        })
    };
  }, [comboId]);

  return <FontComboContext.Provider value={value}>{children}</FontComboContext.Provider>;
}

export function useFontCombo(): FontComboContextValue {
  const context = useContext(FontComboContext);
  if (!context) {
    throw new Error("useFontCombo must be used inside FontComboProvider.");
  }
  return context;
}
