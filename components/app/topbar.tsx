"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarContent, type SidebarProps } from "./sidebar";
import { ROUTE_LABELS } from "./navigation";

/**
 * §24 — Barre supérieure : fil d'Ariane à gauche, aide à droite.
 *
 * §48 — Pas de champ de recherche : la recherche globale n'existe pas encore,
 * un champ décoratif serait un mensonge d'interface.
 * Sous `lg`, le bouton ouvre la navigation en tiroir (§35).
 */
export function Topbar(props: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = ROUTE_LABELS[pathname] ?? "Aequitas";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-md sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="navigation-mobile"
          aria-label="Ouvrir la navigation"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>

        <nav aria-label="Fil d'Ariane" className="min-w-0">
          <ol className="flex items-center gap-2 text-[13.5px]">
            <li className="hidden text-faint sm:block">Aequitas</li>
            <li className="hidden text-faint sm:block" aria-hidden="true">
              /
            </li>
            <li className="truncate font-medium text-ink" aria-current="page">
              {label}
            </li>
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/contact"
            className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius)] px-3 text-[13.5px] font-medium text-ink-soft transition-colors hover:bg-surface-2"
          >
            <HelpCircle className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Aide</span>
          </Link>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40"
            aria-label="Fermer la navigation"
            onClick={() => setOpen(false)}
          />
          <div
            id="navigation-mobile"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-surface shadow-xl"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-3 z-10"
              aria-label="Fermer la navigation"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
            <SidebarContent {...props} />
          </div>
        </div>
      ) : null}
    </>
  );
}
