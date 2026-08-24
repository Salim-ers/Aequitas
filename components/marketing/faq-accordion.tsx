import { Plus } from "lucide-react";
import type { FaqItem } from "@/src/content/faq";
import { cn } from "@/src/lib/utils";

/**
 * FAQ en accordéon.
 *
 * Bâtie sur `<details>` / `<summary>` : le pliage fonctionne sans JavaScript,
 * le clavier l'ouvre nativement, et les lecteurs d'écran annoncent l'état
 * ouvert ou fermé sans qu'on ait à câbler d'aria. Une réimplémentation en
 * React n'apporterait ici qu'un risque de régression d'accessibilité.
 *
 * Le contenu reste dans le DOM même replié : il demeure indexable et
 * cohérent avec les données structurées FAQPage.
 */
export function FaqAccordion({
  items,
  className,
}: {
  items: readonly FaqItem[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <details
          key={item.q}
          className="card-3d group rounded-[18px] px-6 py-1 [&[open]]:pb-5"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span className="text-[17px] font-semibold text-ink">{item.q}</span>
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-muted transition-transform duration-300 group-open:rotate-45 group-open:bg-navy group-open:text-white"
              aria-hidden="true"
            >
              <Plus className="size-4" />
            </span>
          </summary>
          <p className="max-w-3xl pr-14 text-[15.5px] leading-relaxed text-muted">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
