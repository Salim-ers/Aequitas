"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AequitasLogo } from "@/components/brand/aequitas-logo";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/src/lib/utils";

const NAV = [
  { href: "/fonctionnalites", label: "Produit" },
  { href: "/facturation-electronique", label: "Facturation électronique" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/securite", label: "Sécurité" },
  { href: "/developers", label: "Ressources" },
];

/**
 * Header collant de 72 px, fond blanc, filet inférieur très fin.
 * Client uniquement pour l'état de défilement et le tiroir mobile ; tout le
 * contenu de page reste en Server Components.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Tant que le tiroir est ouvert, la page dessous ne défile pas.
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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-surface transition-shadow duration-200",
        scrolled ? "border-line shadow-xs" : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[var(--container-page)] items-center gap-8 px-5 lg:px-8">
        <Link href="/" aria-label="Aequitas, retour à l'accueil" className="shrink-0">
          <AequitasLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-[var(--radius-sm)] px-3 py-2 text-[14.5px] font-medium transition-colors",
                  active ? "text-navy" : "text-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <ButtonLink href="/connexion" variant="ghost">
            Se connecter
          </ButtonLink>
          <ButtonLink href="/inscription">Créer mon compte</ButtonLink>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open ? (
        <div id="menu-mobile" className="border-t border-line bg-surface px-5 py-4 lg:hidden">
          <nav aria-label="Navigation principale" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "rounded-[var(--radius)] px-3 py-3 text-[15px] font-medium",
                  pathname === item.href ? "bg-blue-soft text-navy" : "text-ink-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2 border-t border-line pt-4">
            <ButtonLink href="/inscription" size="lg" className="w-full">
              Créer mon compte
            </ButtonLink>
            <ButtonLink href="/connexion" variant="secondary" size="lg" className="w-full">
              Se connecter
            </ButtonLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
