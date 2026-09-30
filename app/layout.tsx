import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "@excalidraw/excalidraw/index.css";
import "./globals.css";

// Sustitutos de Sohne / Signifier indicados en DESIGN.md
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "In my Mind OS",
  description: "Papers, artículos de investigación, guías paso a paso y experiencias desarrolladas por Physco.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
