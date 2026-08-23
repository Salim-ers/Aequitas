import * as React from "react";
import { cn } from "@/src/lib/utils";

/**
 * Tableaux financiers : lignes confortables, en-têtes discrets, montants
 * alignés à droite en chiffres tabulaires. Le conteneur défile
 * horizontalement plutôt que la page.
 */
export function TableScroll({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // `relative` est nécessaire : un descendant en position absolue — un
  // libellé `sr-only`, par exemple — remonterait sinon jusqu'au document
  // et ferait défiler la page entière horizontalement.
  return <div className={cn("relative w-full overflow-x-auto", className)} {...props} />;
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full min-w-[42rem] text-[14px]", className)} {...props} />;
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
        "border-b border-line px-5 py-3 text-left text-[11.5px] font-medium uppercase tracking-[0.07em] text-faint",
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
        "border-b border-line px-5 py-4 text-ink-soft",
        numeric && "tabular text-right font-semibold text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "transition-colors last:[&>td]:border-0 hover:bg-surface-2/60",
        className,
      )}
      {...props}
    />
  );
}
