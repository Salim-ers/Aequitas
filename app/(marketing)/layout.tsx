import Link from "next/link";
import { AequitasWordmark } from "@/components/aequitas-mark";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/fonctionnalites", label: "Produit" },
  { href: "/facturation-electronique", label: "Facturation électronique" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/securite", label: "Sécurité" },
  { href: "/developers", label: "Développeurs" },
];

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
    title: "Confiance",
    links: [
      { href: "/securite", label: "Sécurité" },
      { href: "/conformite", label: "Conformité" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Développeurs",
    links: [
      { href: "/developers", label: "Documentation API" },
      { href: "/developers#webhooks", label: "Webhooks" },
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
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" aria-label="Aequitas, accueil">
            <AequitasWordmark />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13.5px] text-slate transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/connexion">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
            </Link>
            <Link href="/inscription">
              <Button size="sm">Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-paper-sunken">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
            <div>
              <AequitasWordmark />
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate">
                Créez, envoyez et suivez vos factures depuis un seul espace.
              </p>
            </div>
            {FOOTER.map((group) => (
              <div key={group.title}>
                <p className="eyebrow mb-3">{group.title}</p>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-slate transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* §122 — Mention obligatoire tant que l'immatriculation n'est pas délivrée. */}
          <div className="mt-12 border-t border-line pt-6">
            <p className="max-w-3xl text-[12px] leading-relaxed text-slate-light">
              Aequitas n&apos;est pas actuellement présentée comme Plateforme Agréée tant que
              l&apos;immatriculation correspondante n&apos;a pas été délivrée par
              l&apos;administration fiscale.
            </p>
            <p className="mt-3 text-[12px] text-slate-light">
              © {new Date().getFullYear()} Aequitas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
