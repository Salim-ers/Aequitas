import Link from "next/link";
import { AequitasLogo } from "@/components/brand/aequitas-logo";

/**
 * §30 — Une démarche administrative moderne : peu d'éléments à l'écran,
 * une progression toujours visible, aucune navigation latérale pour distraire.
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-2xl items-center px-6">
          <Link href="/" aria-label="Aequitas, accueil">
            <AequitasLogo />
          </Link>
        </div>
      </header>

      <main id="contenu" className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-12">{children}</div>
      </main>

      <footer className="border-t border-line py-6">
        <p className="mx-auto max-w-2xl px-6 text-[12.5px] text-faint">
          Besoin d&apos;aide ?{" "}
          <Link href="/contact" className="font-medium text-blue hover:underline">
            Écrivez-nous
          </Link>
          , nous répondons sous un jour ouvré.
        </p>
      </footer>
    </div>
  );
}
