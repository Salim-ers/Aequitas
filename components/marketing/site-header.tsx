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
 * §10 — Header collant, dépoli au défilement.
 *
 * Client uniquement pour l'état de défilement et le menu mobile ; tout le
 * contenu de page reste en Server Components.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Un changement de page referme le tiroir.
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
        "sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200",
        scrolled
          ? "border-b border-line bg-canvas/85 backdrop-blur-md"
          : "border-b border-transparent bg-canvas",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
        <Link href="/" aria-label="Aequitas, retour à l'accueil" className="shrink-0">
          <AequitasLogo />
        </Link>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 lg:flex"
          aria-label="Navigation principale"
        >
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-[var(--radius-sm)] px-3 py-2 text-[13.5px] font-medium transition-colors",
                  active ? "text-blue" : "text-muted hover:bg-surface-2 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <ButtonLink href="/connexion" variant="ghost" size="sm">
            Se connecter
          </ButtonLink>
          <ButtonLink href="/inscription" size="sm">
            Essayer gratuitement
          </ButtonLink>
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
        <div
          id="menu-mobile"
          className="border-t border-line bg-canvas px-5 py-4 lg:hidden"
        >
          <nav aria-label="Navigation principale" className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={cn(
                  "rounded-[var(--radius)] px-3 py-3 text-[15px] font-medium",
                  pathname === item.href ? "bg-blue-soft text-blue" : "text-ink-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-2 border-t border-line pt-4">
            <ButtonLink href="/inscription" size="lg" className="w-full">
              Essayer gratuitement
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
