import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[2.25rem] leading-tight tracking-[-0.015em] text-ink">
            {title}
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-slate">{intro}</p>
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-3xl px-5 py-14">{children}</div>
      </section>
    </>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-12 last:mb-0">
      <h2 className="font-display text-[1.375rem] tracking-[-0.01em] text-ink">{title}</h2>
      <div className="mt-4 space-y-3 text-[14.5px] leading-relaxed text-slate">{children}</div>
    </div>
  );
}
