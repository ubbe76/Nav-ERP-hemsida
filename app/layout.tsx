import type { Metadata } from "next";
// First, so every component stylesheet (header and footer included) comes after the globals in the cascade.
import "./globals.css";
import { Figtree, Space_Grotesk } from "next/font/google";
import { BackToTop } from "@/components/BackToTop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SITE, absoluteUrl, withBase } from "@/lib/site";
import { themeBootScript } from "@/lib/themes";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: { default: `${SITE.name} — affärssystemet för svensk tillverkning`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  metadataBase: new URL(absoluteUrl("/")),
  openGraph: {
    type: "website",
    locale: "sv_SE",
    siteName: SITE.name,
    // The real product, light theme — no separate marketing image.
    images: [{ url: absoluteUrl("/screenshots/screenshot-dashboard.png"), width: 2880, height: 1800, alt: "Översikten i Nav|ERP" }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: withBase("/favicon-32x32.png"), sizes: "32x32", type: "image/png" },
      { url: withBase("/favicon-16x16.png"), sizes: "16x16", type: "image/png" },
    ],
    apple: { url: withBase("/apple-touch-icon.png"), sizes: "180x180" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the boot script sets data-theme on <html>
    // before React hydrates — this element's own attributes only.
    <html lang="sv" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} ${figtree.variable}`}>
        <a href="#innehall" className="skipLink">
          Hoppa till innehållet
        </a>
        <SiteHeader />
        <main id="innehall">{children}</main>
        <SiteFooter />
        <BackToTop />
      </body>
    </html>
  );
}
