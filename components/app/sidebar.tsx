"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AequitasLogo } from "@/components/brand/aequitas-logo";
import { NAV_GROUPS } from "./navigation";
import { cn } from "@/src/lib/utils";

export interface SidebarProps {
  planName: string;
  usageRatio: number;
  invoiceUsed: number;
  invoiceLimit: number;
  userName: string;
  organizationName: string;
  /** Ouvre l'entrée vers l'espace plateforme. Le rôle est résolu côté serveur. */
  isPlatformAdmin?: boolean;
}

/**
 * §22-23 — L'état actif est un fond bleu très clair et un texte navy,
 * pas un gros rectangle saturé.
 */
export function SidebarContent(props: SidebarProps) {
  const pathname = usePathname();
  const percent = Math.min(100, Math.round(props.usageRatio * 100));
  const unlimited = props.invoiceLimit < 0;

  return (
    <>
      <div className="flex h-[72px] shrink-0 items-center border-b border-line px-6">
        <Link href="/dashboard" aria-label="Aequitas, accueil">
          <AequitasLogo />
        </Link>
      </div>

      <nav
        className="flex-1 overflow-y-auto px-4 py-6"
        aria-label="Navigation de l'application"
      >
        {NAV_GROUPS.map((group, index) => (
          <div key={group.title ?? `groupe-${index}`} className="mb-7 last:mb-0">
            {group.title ? (
              <p className="px-3 pb-2.5 text-[11px] font-semibold uppercase tracking-[0.09em] text-faint">
                {group.title}
              </p>
            ) : null}

            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.href ? pathname === item.href : false;

                // Sans href, l'écran n'existe pas encore : on l'annonce
                // au lieu d'ouvrir un lien mort.
                if (!item.href) {
                  return (
                    <li key={item.label}>
                      <span
                        aria-disabled="true"
                        className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] text-faint"
                      >
                        <item.icon className="size-4 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        <span className="shrink-0 rounded-full bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-faint">
                          Bientôt
                        </span>
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] transition-colors",
                        active
                          ? "bg-blue-soft font-semibold text-navy"
                          : "text-ink-soft hover:bg-surface-2",
                      )}
                    >
                      <item.icon
                        className={cn("size-4 shrink-0", active ? "text-blue" : "text-faint")}
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-4">
        {props.isPlatformAdmin ? (
          <Link
            href="/admin"
            className="mb-2 flex items-center gap-2.5 rounded-[var(--radius)] bg-navy px-2.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-navy/90"
          >
            <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
            Administration
          </Link>
        ) : null}

        <Link
          href="/abonnement"
          className="block rounded-[10px] border border-line p-3.5 transition-colors hover:border-line-strong hover:bg-surface-2"
        >
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[13px] font-semibold text-ink">Plan {props.planName}</p>
            {!unlimited ? (
              <p className="tabular text-[11.5px] text-faint">{percent} %</p>
            ) : null}
          </div>

          {unlimited ? (
            <p className="mt-1 text-[12px] text-muted">Factures illimitées</p>
          ) : (
            <>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Quota de factures utilisé ce mois"
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-[width]",
                    percent >= 100 ? "bg-danger" : percent >= 80 ? "bg-warning" : "bg-blue",
                  )}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="tabular mt-1.5 text-[12px] text-muted">
                {props.invoiceUsed} / {props.invoiceLimit} factures ce mois
              </p>
            </>
          )}
        </Link>

        <div className="mt-2 flex items-center gap-2.5 border-t border-line px-2.5 pt-3">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-semibold text-white"
            aria-hidden="true"
          >
            {initials(props.userName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{props.userName}</p>
            <p className="truncate text-[12px] text-faint">{props.organizationName}</p>
          </div>
        </div>
      </div>
    </>
  );
}

/** Colonne fixe, écrans larges uniquement. */
export function Sidebar(props: SidebarProps) {
  return (
    <aside className="flex h-full w-[17rem] shrink-0 flex-col border-r border-line bg-surface">
      <SidebarContent {...props} />
    </aside>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/[\s@.]+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0] ?? "");
  return letters.join("").toUpperCase() || "?";
}
