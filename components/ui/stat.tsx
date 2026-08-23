import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

/**
 * Un chiffre financier se lit d'abord, se qualifie ensuite.
 * Chiffres en tabular-nums pour qu'une colonne de montants s'aligne.
 */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  className,
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
  className?: string;
}) {
  const accent = {
    neutral: "text-faint",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  }[tone];

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface px-5 py-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        {icon ? <span className={cn("shrink-0", accent)}>{icon}</span> : null}
      </div>
      <p className="tabular mt-2 text-[1.625rem] font-semibold leading-none tracking-[-0.02em] text-ink">
        {value}
      </p>
      {hint ? <p className="mt-2 text-[12.5px] text-faint">{hint}</p> : null}
    </div>
  );
}
