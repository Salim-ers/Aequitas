import Link from "next/link";
import { AequitasLogo } from "@/components/brand/aequitas-logo";
import { SiteHeader } from "@/components/marketing/site-header";

/** §56 — Quatre colonnes, une phrase, la mention réglementaire en bas. */
const FOOTER = [
  {
    title: "Produit",
    links: [
      { href: "/fonctionnalites", label: "Fonctionnalités" },
      { href: "/facturation-electronique", label: "Facturation électronique" },
      { href: "/tarifs", label: "Tarifs" },
      { href: "/integrations", label: "Intégrations" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { href: "/securite", label: "Sécurité" },
      { href: "/conformite", label: "Conformité" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/developers", label: "Documentation API" },
      { href: "/facturation-electronique", label: "Comprendre la réforme" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
      { href: "/cgu", label: "CGU" },
      { href: "/cgv", label: "CGV" },
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
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
            <div>
              <AequitasLogo />
              <p className="mt-4 max-w-[15rem] text-[13.5px] leading-relaxed text-muted">
                La facturation électronique, sans la complexité.
              </p>
            </div>

            {FOOTER.map((group) => (
              <div key={group.title}>
                <p className="text-[13px] font-semibold text-ink">{group.title}</p>
                <ul className="mt-3 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={`${group.title}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-muted transition-colors hover:text-blue"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-[12.5px] text-faint">
              © {new Date().getFullYear()} Aequitas
            </p>
            {/* §42 / §122 — Mention tant que l'immatriculation n'est pas délivrée. */}
            <p className="max-w-2xl text-[12px] leading-relaxed text-faint">
              Aequitas prépare son infrastructure en vue de son immatriculation en
              qualité de Plateforme Agréée. Les fonctionnalités réglementaires sont
              activées progressivement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
