"use client";

import { useEffect } from "react";

/**
 * §37 — Apparition à l'entrée dans le viewport, landing uniquement.
 *
 * Un seul observateur pour toute la page plutôt qu'un composant client par
 * bloc : le contenu reste en Server Components, seul cet écouteur est client.
 * Sans JavaScript, `data-reveal` n'est jamais posé et tout reste visible.
 */
export function RevealScript() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (targets.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    for (const el of targets) {
      if (!el.dataset.reveal) el.dataset.reveal = "pending";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.dataset.reveal = "shown";
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    for (const el of targets) observer.observe(el);

    // Filet de sécurité : si l'observateur ne se déclenche jamais (onglet en
    // arrière-plan, capture automatisée, mise en page inattendue), rien ne
    // doit rester invisible.
    const failsafe = window.setTimeout(() => {
      for (const el of targets) el.dataset.reveal = "shown";
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return null;
}
