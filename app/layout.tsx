import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { baseUrl } from "@/src/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: "Aequitas — La facturation électronique, simplement",
    template: "%s — Aequitas",
  },
  description:
    "Aequitas centralise vos factures, vos paiements et vos obligations de facturation électronique dans une plateforme moderne conçue pour les entreprises françaises.",
  applicationName: "Aequitas",
  keywords: [
    "facturation électronique",
    "Factur-X",
    "logiciel de facturation",
    "devis",
    "e-reporting",
    "TVA",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Aequitas",
    title: "Aequitas — La facturation électronique, simplement",
    description:
      "Créez, envoyez et suivez vos factures depuis un seul espace. Conçu pour les entreprises françaises.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1211" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
