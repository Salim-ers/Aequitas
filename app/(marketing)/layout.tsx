import Link from "next/link";
import { AequitasLogo } from "@/components/brand/aequitas-logo";
import { SiteHeader } from "@/components/marketing/site-header";

/** Footer institutionnel : quatre colonnes, mention réglementaire en pied. */
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
      { href: "/facturation-electronique", label: "Réforme" },
      { href: "/faq", label: "Questions fréquentes" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { href: "/demarche-pa", label: "Démarche PA" },
      { href: "/integrations", label: "Intégrations" },
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
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-16 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <AequitasLogo />
              <p className="mt-4 max-w-[16rem] text-[14px] leading-relaxed text-muted">
                La plateforme française de facturation électronique.
              </p>
              <span className="tricolore mt-5" aria-hidden="true" />
            </div>

            {FOOTER.map((group) => (
              <div key={group.title}>
                <p className="text-[13.5px] font-semibold text-ink">{group.title}</p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-muted transition-colors hover:text-navy"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-line pt-6">
            <p className="text-[13px] text-faint">© {new Date().getFullYear()} Aequitas</p>
            {/* Mention tant que l'immatriculation n'est pas délivrée. */}
            <p className="mt-3 max-w-3xl text-[12.5px] leading-relaxed text-faint">
              Aequitas prépare son infrastructure en vue de son immatriculation en qualité
              de Plateforme Agréée. Le statut réglementaire évoluera en fonction de
              l&apos;avancement de la procédure officielle.{" "}
              <Link
                href="/demarche-pa"
                className="font-medium text-blue hover:underline"
              >
                Suivre notre démarche PA →
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
