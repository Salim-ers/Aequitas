import Link from "next/link";
import { AequitasLogo } from "@/components/brand/aequitas-logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-block">
            <AequitasLogo />
          </Link>
          <div className="mt-10">{children}</div>
        </div>
      </div>

      <aside className="hidden border-l border-line bg-surface-2 lg:flex lg:flex-col lg:justify-center lg:px-14">
        <blockquote className="max-w-md">
          <p className="font-semibold text-[1.75rem] leading-snug tracking-[-0.01em] text-ink">
            Créez, envoyez et suivez vos factures depuis un seul espace.
          </p>
          <p className="mt-6 text-[14px] leading-relaxed text-muted">
            Numérotation séquentielle, TVA multi-taux, relances, exports. Aequitas
            s&apos;occupe de la mécanique pour que vous vous occupiez du reste.
          </p>
        </blockquote>
      </aside>
    </div>
  );
}
