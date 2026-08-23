import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface TimelineStep {
  label: string;
  detail?: ReactNode;
  state: "done" | "current" | "upcoming";
}

/** §34 — Le suivi d'une facture, lisible sans connaître le vocabulaire métier. */
export function Timeline({ steps, className }: { steps: TimelineStep[]; className?: string }) {
  return (
    <ol className={cn("space-y-0", className)}>
      {steps.map((step, index) => {
        const last = index === steps.length - 1;
        return (
          <li key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                  step.state === "done" && "border-success bg-success text-white",
                  step.state === "current" && "border-blue bg-blue-soft",
                  step.state === "upcoming" && "border-line-strong bg-surface",
                )}
              >
                {step.state === "done" ? (
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                ) : step.state === "current" ? (
                  <span className="size-1.5 rounded-full bg-blue" />
                ) : null}
              </span>
              {!last ? (
                <span
                  className={cn(
                    "w-0.5 flex-1",
                    step.state === "done" ? "bg-success/30" : "bg-line",
                  )}
                />
              ) : null}
            </div>
            <div className={cn("min-w-0", last ? "pb-0" : "pb-5")}>
              <p
                className={cn(
                  "text-[13.5px] font-medium",
                  step.state === "upcoming" ? "text-faint" : "text-ink",
                )}
              >
                {step.label}
                {step.state === "current" ? (
                  <span className="sr-only"> — étape en cours</span>
                ) : null}
              </p>
              {step.detail ? (
                <div className="mt-0.5 text-[12.5px] text-muted">{step.detail}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
