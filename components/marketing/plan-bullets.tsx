import { Check, Clock } from "lucide-react";
import type { PlanBullet } from "@/src/config/plans";
import { cn } from "@/src/lib/utils";

/**
 * Puces d'une offre.
 *
 * Une ligne incluse mais pas encore livrée porte la mention « Bientôt » et
 * une icône distincte : l'information ne dépend jamais de la seule couleur.
 * C'est le seul rendu de puces du site, pour qu'aucun écran ne puisse
 * afficher une coche verte sur une fonctionnalité inexistante.
 */
export function PlanBullets({
  bullets,
  limit,
  className,
}: {
  bullets: readonly PlanBullet[];
  limit?: number;
  className?: string;
}) {
  const shown = limit ? bullets.slice(0, limit) : bullets;

  return (
    <ul className={cn("space-y-2.5", className)}>
      {shown.map((bullet) => (
        <li
          key={bullet.label}
          className={cn(
            "flex gap-2.5 text-[14px]",
            bullet.soon ? "text-muted" : "text-ink-soft",
          )}
        >
          {bullet.soon ? (
            <Clock className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden="true" />
          ) : (
            <Check
              className="mt-0.5 size-4 shrink-0 text-blue"
              strokeWidth={2.5}
              aria-hidden="true"
            />
          )}
          <span>
            {bullet.label}
            {bullet.soon ? (
              <span className="ml-1.5 rounded-full bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-faint">
                Bientôt
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
