import * as React from "react";
import { cn } from "@/src/lib/utils";

/**
 * §46 — Tableaux financiers : lignes confortables, en-têtes discrets,
 * montants alignés à droite en chiffres tabulaires.
 * Le conteneur défile horizontalement plutôt que la page (§35).
 */
export function TableScroll({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("w-full overflow-x-auto", className)} {...props} />;
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("w-full min-w-[42rem] text-[13.5px]", className)} {...props} />
  );
}

export function Th({
  className,
  numeric,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-line bg-surface-2/60 px-4 py-2.5 text-left text-[12px] font-medium uppercase tracking-[0.04em] text-faint",
        numeric && "text-right",
        className,
      )}
      {...props}
    />
  );
}

export function Td({
  className,
  numeric,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <td
      className={cn(
        "border-b border-line px-4 py-3.5 text-ink-soft",
        numeric && "tabular text-right font-medium text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors last:[&>td]:border-0 hover:bg-surface-2/50", className)}
      {...props}
    />
  );
}
