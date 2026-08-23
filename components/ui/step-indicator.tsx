import { cn } from "@/src/lib/utils";

/** §30 — La progression d'une démarche doit être visible en permanence. */
export function StepIndicator({
  current,
  total,
  label,
  className,
}: {
  current: number;
  total: number;
  label?: string;
  className?: string;
}) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[13px] font-medium text-blue">
          Étape {current} sur {total}
        </p>
        {label ? <p className="text-[13px] text-muted">{label}</p> : null}
      </div>
      <div
        className="mt-2 flex gap-1.5"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Étape ${current} sur ${total}`}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < current ? "bg-blue" : "bg-line",
            )}
          />
        ))}
      </div>
      <span className="sr-only">{percent} % de la configuration effectuée</span>
    </div>
  );
}
