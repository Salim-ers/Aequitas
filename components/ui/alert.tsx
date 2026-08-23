import type { ReactNode } from "react";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";

/**
 * §43 — Quatre niveaux, quatre intentions.
 * L'icône double la couleur : l'information ne dépend jamais de la teinte seule.
 */
const TONES = {
  info: {
    icon: Info,
    box: "border-blue-border bg-blue-soft",
    mark: "text-blue",
    title: "text-navy",
    body: "text-ink-soft",
    role: "status" as const,
  },
  success: {
    icon: CheckCircle2,
    box: "border-success-border bg-success-soft",
    mark: "text-success",
    title: "text-success",
    body: "text-ink-soft",
    role: "status" as const,
  },
  warning: {
    icon: AlertTriangle,
    box: "border-warning-border bg-warning-soft",
    mark: "text-warning",
    title: "text-warning",
    body: "text-ink-soft",
    role: "status" as const,
  },
  critical: {
    icon: XCircle,
    box: "border-danger-border bg-danger-soft",
    mark: "text-danger",
    title: "text-danger",
    body: "text-ink-soft",
    role: "alert" as const,
  },
};

export type AlertTone = keyof typeof TONES;

export function Alert({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  const Icon = t.icon;

  return (
    <div
      role={t.role}
      className={cn("flex gap-3 rounded-[var(--radius)] border px-4 py-3", t.box, className)}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", t.mark)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? (
          <p className={cn("text-[13.5px] font-semibold", t.title)}>{title}</p>
        ) : null}
        {children ? (
          <div className={cn("text-[13px] leading-relaxed", t.body, title && "mt-1")}>
            {children}
          </div>
        ) : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>
    </div>
  );
}

export const InfoAlert = (p: Omit<Parameters<typeof Alert>[0], "tone">) => (
  <Alert tone="info" {...p} />
);
export const SuccessAlert = (p: Omit<Parameters<typeof Alert>[0], "tone">) => (
  <Alert tone="success" {...p} />
);
export const WarningAlert = (p: Omit<Parameters<typeof Alert>[0], "tone">) => (
  <Alert tone="warning" {...p} />
);
export const CriticalAlert = (p: Omit<Parameters<typeof Alert>[0], "tone">) => (
  <Alert tone="critical" {...p} />
);
