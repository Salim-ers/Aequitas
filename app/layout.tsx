import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { baseUrl } from "@/src/lib/env";
import "./globals.css";

/** Auto-hébergée au build : aucune requête tierce, aucun décalage de rendu. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  title: {
    default: "Aequitas — La facturation électronique, sans la complexité",
    template: "%s — Aequitas",
  },
  description:
    "Créez vos devis, envoyez vos factures et suivez vos paiements depuis un seul espace. Aequitas accompagne les entreprises françaises dans le passage à la facturation électronique.",
  applicationName: "Aequitas",
  keywords: [
    "logiciel de facturation électronique",
    "facturation électronique entreprise",
    "logiciel de facturation France",
    "Factur-X",
    "facture électronique",
    "devis et factures",
    "e-reporting",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Aequitas",
    title: "Aequitas — La facturation électronique, sans la complexité",
    description:
      "Créez, envoyez et suivez vos factures depuis un seul espace. Conçu pour les entreprises françaises.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aequitas — La facturation électronique, sans la complexité",
    description:
      "Créez, envoyez et suivez vos factures depuis un seul espace. Conçu pour les entreprises françaises.",
  },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f9fc",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable} suppressHydrationWarning>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius)] focus:bg-blue focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Aller au contenu
        </a>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "var(--radius)",
              border: "1px solid var(--color-line)",
              fontSize: "13.5px",
            },
          }}
        />
      </body>
    </html>
  );
}
