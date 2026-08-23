import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

/**
 * §8 — Une seule action doit dominer visuellement.
 * `action` reçoit le CTA principal ; tout le reste passe en `secondary`.
 */
export function PageHeader({
  title,
  description,
  action,
  secondary,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  secondary?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-ink sm:text-[1.75rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action || secondary ? (
        <div className="flex shrink-0 items-center gap-2">
          {secondary}
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2
        className={cn(
          "text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.025em] text-ink sm:text-[2.125rem]",
          eyebrow && "mt-3",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[16px] leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}
