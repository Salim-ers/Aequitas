import Link from "next/link";
import { AequitasLogo } from "@/components/brand/aequitas-logo";
import { SiteHeader } from "@/components/marketing/site-header";

/**
 * Footer institutionnel.
 * Quatre colonnes, la marque à gauche, et la mention réglementaire isolée
 * en bas — elle doit rester lisible, pas noyée dans les liens.
 */
const FOOTER = [
  {
    title: "Produit",
    links: [
      { href: "/fonctionnalites", label: "Fonctionnalités" },
      { href: "/facturation-electronique", label: "Facturation électronique" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/securite", label: "Sécurité" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/developers", label: "Documentation" },
      { href: "/facturation-electronique", label: "Réforme 2026 — 2027" },
      { href: "/faq", label: "Questions fréquentes" },
      { href: "/integrations", label: "Intégrations" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { href: "/demarche-pa", label: "Démarche PA" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgu", label: "CGU" },
      { href: "/cgv", label: "CGV" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main id="contenu" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(4,1fr)] lg:gap-10">
            <div>
              <AequitasLogo />
              <p className="mt-5 max-w-[17rem] text-[15px] leading-relaxed text-muted">
                La plateforme française de facturation électronique.
              </p>
              <span className="tricolore mt-6 w-16" aria-hidden="true" />
              <p className="mt-6 text-[13.5px] leading-relaxed text-faint">
                Une question ?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-blue hover:underline"
                >
                  Écrivez-nous
                </Link>
              </p>
            </div>

            {FOOTER.map((group) => (
              <div key={group.title}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-faint">
                  {group.title}
                </p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[14.5px] text-ink-soft transition-colors hover:text-blue"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mention réglementaire : isolée dans son propre bloc pour rester lue. */}
          <div className="mt-16 rounded-[18px] border border-line bg-canvas px-6 py-5">
            <p className="max-w-4xl text-[13px] leading-relaxed text-muted">
              Aequitas prépare son infrastructure en vue de son immatriculation en
              qualité de Plateforme Agréée. Le statut réglementaire évoluera en
              fonction de l&apos;avancement de la procédure officielle.{" "}
              <Link
                href="/demarche-pa"
                className="font-medium text-blue hover:underline"
              >
                Suivre notre démarche
              </Link>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <p className="text-[13px] text-faint">
              © {new Date().getFullYear()} Aequitas
            </p>
            <p className="text-[13px] text-faint">Conçu et développé en France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
