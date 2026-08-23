"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, ScrollText, FlaskConical, ArrowLeft } from "lucide-react";
import { AequitasMark } from "@/components/brand/aequitas-logo";
import { cn } from "@/src/lib/utils";

export const ADMIN_ITEMS = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/organisations", label: "Organisations", icon: Building2 },
  { href: "/admin/journal", label: "Journal d'audit", icon: ScrollText },
  { href: "/admin/bac-a-sable", label: "Bac à sable", icon: FlaskConical },
];

/**
 * L'espace admin porte une identité volontairement distincte de l'espace
 * client : fond navy, mention « Plateforme ». On doit voir d'un coup d'œil
 * qu'on n'est plus dans son entreprise.
 */
export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="on-navy flex h-full w-60 shrink-0 flex-col bg-navy">
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5">
        <AequitasMark className="size-6" tone="light" />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold leading-tight text-white">Aequitas</p>
          <p className="text-[11px] leading-tight text-white/50">Plateforme</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Navigation de l'administration">
        <ul className="space-y-0.5">
          {ADMIN_ITEMS.map((item) => {
            const active =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-[var(--radius)] px-2.5 py-2 text-[13.5px] transition-colors",
                    active
                      ? "bg-white/12 font-medium text-white"
                      : "text-white/65 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-[var(--radius)] px-2.5 py-2 text-[13px] text-white/65 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
          Retour à mon espace
        </Link>
        <p className="truncate px-2.5 pt-2 text-[12px] text-white/45">{userName}</p>
      </div>
    </aside>
  );
}

/** Sous `lg`, la colonne disparaît : la navigation passe en onglets. */
export function AdminNavMobile() {
  const pathname = usePathname();

  return (
    <div className="on-navy sticky top-0 z-30 bg-navy lg:hidden">
      <div className="flex h-14 items-center gap-2.5 px-4">
        <AequitasMark className="size-5" tone="light" />
        <p className="text-[13px] font-semibold text-white">Aequitas</p>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white">
          Plateforme
        </span>
        <Link
          href="/dashboard"
          className="ml-auto rounded-[var(--radius)] px-2.5 py-1.5 text-[12.5px] text-white/70 hover:bg-white/10 hover:text-white"
        >
          Mon espace
        </Link>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 pb-2 pt-1.5"
        aria-label="Navigation de l'administration"
      >
        {ADMIN_ITEMS.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-[var(--radius)] px-3 py-1.5 text-[13px] transition-colors",
                active ? "bg-white/15 font-medium text-white" : "text-white/60",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
