import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

/**
 * §36 — La couleur ne porte jamais seule l'information : chaque badge
 * affiche un libellé explicite, et les statuts ajoutent une pastille
 * de forme distincte.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-line-strong bg-surface-2 text-muted",
        blue: "border-blue-border bg-blue-soft text-blue",
        navy: "border-transparent bg-navy text-white",
        success: "border-success-border bg-success-soft text-success",
        warning: "border-warning-border bg-warning-soft text-warning",
        danger: "border-danger-border bg-danger-soft text-danger",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Ajoute une pastille colorée devant le libellé. */
  dot?: boolean;
}

export function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? (
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
}

/**
 * Statuts métier d'une facture, en français courant.
 * Un chef de PME doit les comprendre sans avoir lu de documentation.
 */
export const INVOICE_STATUS: Record<string, { label: string; tone: BadgeTone }> = {
  draft: { label: "Brouillon", tone: "neutral" },
  to_send: { label: "À envoyer", tone: "blue" },
  sent: { label: "Envoyée", tone: "navy" },
  paid: { label: "Payée", tone: "success" },
  overdue: { label: "En retard", tone: "danger" },
  to_check: { label: "À vérifier", tone: "warning" },
  cancelled: { label: "Annulée", tone: "neutral" },
};

export function StatusBadge({ status }: { status: keyof typeof INVOICE_STATUS | string }) {
  const entry = INVOICE_STATUS[status] ?? INVOICE_STATUS.draft!;
  return (
    <Badge tone={entry.tone} dot>
      {entry.label}
    </Badge>
  );
}
