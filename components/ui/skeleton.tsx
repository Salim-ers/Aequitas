import { cn } from "@/src/lib/utils";

/** §38 — Un chargement montre la forme à venir, pas un spinner nu. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("skeleton rounded-[var(--radius-sm)]", className)}
      aria-hidden="true"
    />
  );
}
