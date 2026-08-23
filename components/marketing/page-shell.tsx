import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

/**
 * Gabarit des pages informatives et légales.
 * Mesure de ligne contenue, sections nettement séparées : ces pages se lisent,
 * elles ne se parcourent pas.
 */
export function PageShell({
  eyebrow,
  title,
  intro,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            {title}
          </h1>
          <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{intro}</p>
          {aside ? <div className="mt-8">{aside}</div> : null}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5 py-14">{children}</div>
      </section>
    </>
  );
}

export function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 border-t border-line pt-8 first:mt-0 first:border-0 first:pt-0", className)}>
      <h2 className="text-[1.25rem] font-semibold tracking-[-0.015em] text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-[1.7] text-muted [&_a]:font-medium [&_a]:text-blue hover:[&_a]:underline [&_strong]:font-semibold [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
