import Link from "next/link";
import { AequitasLogo } from "@/components/brand/aequitas-logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Link href="/" aria-label="Aequitas, accueil">
        <AequitasLogo />
      </Link>
      <p className="eyebrow mt-12">Erreur 404</p>
      <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] text-ink">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-muted">
        Le lien est peut-être obsolète, ou la page a été déplacée.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Nous signaler le problème
        </ButtonLink>
      </div>
    </div>
  );
}
