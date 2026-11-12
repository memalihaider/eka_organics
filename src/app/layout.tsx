import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { StoreProvider } from "@/components/store/StoreProvider";
import { ModalRoot, Reveal, Toast } from "@/components/store/Overlays";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Eka Organics — Ayurvedic Rituals for Every Chapter", template: "%s — Eka Organics" },
  description: "Nabhi Ritual Oil for women 40+, belly oils, postpartum rituals and gentle baby care. Traditional inspiration, modern formulation, transparent ingredients.",
  icons: { icon: "/img/icon.png", apple: "/img/icon.png" },
  openGraph: { siteName: "Eka Organics", images: ["/img/brand-taupe.png"], locale: "en_IN", type: "website" },
};

export const viewport: Viewport = { themeColor: "#3D2F26" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. crxlauncher) inject attributes
    // into <html> before React hydrates. This only silences this element's own attributes.
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <StoreProvider>
          {children}
          <ModalRoot />
          <Toast />
          <Reveal />
        </StoreProvider>
      </body>
    </html>
  );
}
