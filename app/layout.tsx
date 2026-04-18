import type { Metadata } from "next";
import {
  Allura,
  Cormorant_Garamond,
  Dancing_Script,
  DM_Serif_Display,
  Great_Vibes,
  Instrument_Serif,
  Playfair_Display,
  Style_Script
} from "next/font/google";
import { AccessibilityProvider } from "@/components/accessibility-provider";
import { FontComboProvider } from "@/components/font-combo-provider";
import { SiteAnalytics } from "@/components/site-analytics";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const styleScript = Style_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-style-script"
});

const allura = Allura({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-allura",
  preload: false
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  preload: false
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing-script",
  preload: false
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  variable: "--font-instrument-serif"
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400"],
  variable: "--font-dm-serif-display",
  preload: false
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-garamond",
  preload: false
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair-display",
  preload: false
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Bhavesh Jain",
    template: "%s | Bhavesh Jain"
  },
  description:
    "Personal website of Bhavesh Jain - quant builder, traveler, and photographer.",
  keywords: [
    "Bhavesh Jain",
    "Quant",
    "Trading",
    "Photography",
    "Travel",
    "Portfolio"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    title: "Bhavesh Jain",
    description:
      "Personal website of Bhavesh Jain - quant builder, traveler, and photographer.",
    url: "/",
    siteName: "Bhavesh Jain"
  },
  icons: {
    icon: "/logo-mark.svg",
    shortcut: "/logo-mark.svg",
    apple: "/logo-mark.svg"
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhavesh Jain",
    description:
      "Personal website of Bhavesh Jain - quant builder, traveler, and photographer."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${styleScript.variable} ${allura.variable} ${greatVibes.variable} ${dancingScript.variable} ${instrumentSerif.variable} ${dmSerifDisplay.variable} ${cormorantGaramond.variable} ${playfairDisplay.variable}`}
      >
        <AccessibilityProvider>
          <ThemeProvider>
            <FontComboProvider>
              {children}
              <SiteAnalytics />
            </FontComboProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
