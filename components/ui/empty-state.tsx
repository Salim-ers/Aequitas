import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

/** §81 — Un écran vide dit quoi faire, pas seulement qu'il est vide. */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-line-strong bg-paper-raised px-6 py-16 text-center",
        className,
      )}
    >
      {icon ? <div className="mb-4 text-slate-light">{icon}</div> : null}
      <p className="text-[15px] font-medium text-ink">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-slate">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
