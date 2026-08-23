"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

/** §68 — Le détail technique reste côté serveur ; l'utilisateur voit une issue. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      JSON.stringify({ level: "error", event: "ui.render_failed", digest: error.digest }),
    );
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Erreur 500</p>
      <h1 className="mt-4 font-display text-[2rem] tracking-[-0.015em] text-ink">
        Cette page n&apos;a pas pu s&apos;afficher
      </h1>
      <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-slate">
        L&apos;incident a été enregistré. Réessayez ; si le problème persiste, écrivez à
        support@aequitas.fr en indiquant la référence {error.digest ?? "inconnue"}.
      </p>
      <Button className="mt-8" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
