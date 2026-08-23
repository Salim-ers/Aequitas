import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

/**
 * Un chiffre financier se lit d'abord, se qualifie ensuite.
 * Chiffres en tabular-nums pour qu'une colonne de montants s'aligne, et
 * libellé en capitales discrètes pour que la valeur reste le point d'entrée.
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
        "rounded-[12px] border border-line bg-surface px-5 py-4 transition-colors hover:border-line-strong",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11.5px] font-medium uppercase tracking-[0.07em] text-faint">
          {label}
        </p>
        {icon ? <span className={cn("shrink-0", accent)}>{icon}</span> : null}
      </div>
      <p
        className={cn(
          "tabular mt-3 text-[1.75rem] font-semibold leading-none tracking-[-0.03em]",
          tone === "danger" ? "text-danger" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2.5 text-[12.5px] text-faint">{hint}</p> : null}
    </div>
  );
}
