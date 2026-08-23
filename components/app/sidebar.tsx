import Link from "next/link";
import {
  LayoutDashboard, FileText, Receipt, RotateCcw, Truck, ShoppingCart,
  Users, Package, Banknote, Send, BarChart3, KeyRound, Webhook,
  UsersRound, ScrollText, Settings,
} from "lucide-react";
import { AequitasLogo } from "@/components/brand/aequitas-logo";

/** §79 — Sidebar applicative. */
const GROUPS = [
  { items: [{ href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard }] },
  {
    title: "Ventes",
    items: [
      { href: "/devis", label: "Devis", icon: FileText },
      { href: "/factures", label: "Factures", icon: Receipt },
      { href: "/avoirs", label: "Avoirs", icon: RotateCcw },
    ],
  },
  {
    title: "Achats",
    items: [
      { href: "/achats", label: "Factures fournisseurs", icon: ShoppingCart },
      { href: "/fournisseurs", label: "Fournisseurs", icon: Truck },
    ],
  },
  {
    items: [
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/catalogue", label: "Catalogue", icon: Package },
      { href: "/paiements", label: "Paiements", icon: Banknote },
    ],
  },
  {
    title: "Facturation électronique",
    items: [
      { href: "/transmissions", label: "Transmissions", icon: Send },
      { href: "/e-reporting", label: "E-reporting", icon: BarChart3 },
    ],
  },
  {
    title: "Développeurs",
    items: [
      { href: "/api", label: "API", icon: KeyRound },
      { href: "/webhooks", label: "Webhooks", icon: Webhook },
    ],
  },
  {
    title: "Organisation",
    items: [
      { href: "/equipe", label: "Équipe", icon: UsersRound },
      { href: "/audit", label: "Audit", icon: ScrollText },
    ],
  },
  { items: [{ href: "/parametres", label: "Paramètres", icon: Settings }] },
] as const;

export function Sidebar({
  planName,
  usageRatio,
  userName,
  organizationName,
}: {
  planName: string;
  usageRatio: number;
  userName: string;
  organizationName: string;
}) {
  const percent = Math.min(100, Math.round(usageRatio * 100));

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-line bg-surface-2">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link href="/dashboard">
          <AequitasLogo />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation de l'application">
        {GROUPS.map((group, index) => (
          <div key={index} className="mb-5 last:mb-0">
            {"title" in group && group.title ? (
              <p className="eyebrow px-2 pb-2">{group.title}</p>
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-1.5 text-[13.5px] text-muted transition-colors hover:bg-surface hover:text-ink"
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-4">
        <Link href="/abonnement" className="block rounded-[var(--radius)] p-2 hover:bg-surface">
          <p className="text-[13px] font-medium text-ink">Plan {planName}</p>
          <div
            className="mt-2 h-1 overflow-hidden rounded-full bg-line-strong"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Utilisation du quota de factures"
          >
            <div className="h-full bg-blue" style={{ width: `${percent}%` }} />
          </div>
          <p className="tabular mt-1.5 text-[12px] text-muted">{percent} % utilisé</p>
        </Link>

        <div className="mt-3 border-t border-line pt-3">
          <p className="truncate text-[13px] font-medium text-ink">{userName}</p>
          <p className="truncate text-[12px] text-muted">{organizationName}</p>
        </div>
      </div>
    </aside>
  );
}
