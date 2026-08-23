"use client";

import { useEffect } from "react";

/**
 * Animations de la landing.
 *
 * Périmètre volontairement fermé : entrée du hero, maquette produit, timeline
 * de la réforme, et apparition légère des sections au défilement. Rien d'autre.
 * Pas de scroll hijacking, pas d'animation permanente.
 *
 * GSAP est chargé en import dynamique, après le premier rendu : il ne pèse ni
 * sur le HTML initial ni sur le chemin critique. Si le chargement échoue, un
 * repli en IntersectionObserver assure la même apparition — et dans tous les
 * cas, un contenu non animé reste visible.
 *
 * `prefers-reduced-motion` court-circuite tout : aucune animation n'est
 * initialisée, aucun élément n'est masqué.
 */
export function RevealScript() {
  useEffect(() => {
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const hero = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-step]"));
    if (targets.length === 0 && hero.length === 0) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // Masque juste avant d'animer : sans JavaScript, rien n'est jamais caché.
    for (const el of targets) {
      if (!el.dataset.reveal) el.dataset.reveal = "pending";
    }

    /** Repli sans dépendance, utilisé si GSAP ne se charge pas. */
    function observerFallback(): () => void {
      if (!("IntersectionObserver" in window)) {
        for (const el of targets) el.dataset.reveal = "shown";
        return () => {};
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.reveal = "shown";
            observer.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
      );
      for (const el of targets) observer.observe(el);
      return () => observer.disconnect();
    }

    void (async () => {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;

        gsap.registerPlugin(ScrollTrigger);
        const context = gsap.context(() => {
          // Entrée du hero : une seule séquence, décalée, sous 900 ms.
          if (hero.length > 0) {
            gsap.from(hero, {
              opacity: 0,
              y: 18,
              duration: 0.65,
              ease: "power3.out",
              stagger: 0.08,
            });
          }

          // Sections et maquettes : apparition à l'entrée dans le viewport.
          for (const el of targets) {
            const delay = Number.parseFloat(
              getComputedStyle(el).getPropertyValue("--reveal-delay") || "0",
            );
            gsap.fromTo(
              el,
              { opacity: 0, y: 16 },
              {
                opacity: 1,
                y: 0,
                duration: 0.62,
                delay: Number.isFinite(delay) ? delay / 1000 : 0,
                ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
                // L'attribut retire la règle CSS qui masquait l'élément :
                // GSAP prend le relais de l'opacité à partir d'ici.
                onStart: () => {
                  el.dataset.reveal = "gsap";
                },
              },
            );
          }
        });

        // Filet de sécurité : rien ne doit rester invisible si un déclencheur
        // ne se produit jamais (onglet en arrière-plan, capture automatisée).
        const failsafe = window.setTimeout(() => {
          for (const el of targets) {
            if (el.dataset.reveal === "pending") el.dataset.reveal = "shown";
          }
        }, 1800);

        cleanup = () => {
          window.clearTimeout(failsafe);
          context.revert();
          for (const el of targets) el.dataset.reveal = "shown";
        };
      } catch {
        if (cancelled) return;
        cleanup = observerFallback();
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
