import Link from "next/link";
import { Check } from "lucide-react";
import { AequitasLogo, AequitasMark } from "@/components/brand/aequitas-logo";

/**
 * §32 — Desktop : formulaire à gauche, marque très légère à droite.
 * Mobile : formulaire seul, le panneau de droite disparaît entièrement.
 */
const POINTS = [
  "Devis, factures et avoirs dans un seul espace",
  "Suivi des paiements et des retards, en temps réel",
  "Accompagnement pour la facturation électronique",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_0.85fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" className="inline-flex self-start" aria-label="Aequitas, accueil">
          <AequitasLogo />
        </Link>

        <main id="contenu" className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-sm">{children}</div>
        </main>
      </div>

      <aside className="on-navy hidden bg-navy px-14 lg:flex lg:flex-col lg:justify-center">
        <AequitasMark className="size-10" tone="light" detailed />
        <p className="mt-8 max-w-md text-[1.625rem] font-semibold leading-snug tracking-[-0.02em] text-white">
          La facturation électronique, sans la complexité.
        </p>
        <ul className="mt-8 space-y-3">
          {POINTS.map((point) => (
            <li key={point} className="flex gap-3 text-[14.5px] leading-relaxed text-white/75">
              <Check
                className="mt-0.5 size-4 shrink-0 text-white"
                strokeWidth={2.5}
                aria-hidden="true"
              />
              {point}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
