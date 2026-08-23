import { cn } from "@/src/lib/utils";

/**
 * §119 — Mot-marque Aequitas.
 * Le symbole est une barre d'équilibre : deux traits de longueur égale
 * de part et d'autre d'un point d'appui. Pas de balance, pas de marteau.
 */
export function AequitasMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("size-5", className)}
      aria-hidden="true"
    >
      <path
        d="M12 4v16"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AequitasWordmark({
  className,
  showMark = true,
}: {
  className?: string;
  showMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-ink", className)}>
      {showMark ? <AequitasMark className="text-petrol" /> : null}
      <span className="wordmark text-[15px]">Aequitas</span>
    </span>
  );
}
