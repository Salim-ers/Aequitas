import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-4 font-display text-[2rem] tracking-[-0.015em] text-ink">
        Cette page n&apos;existe pas
      </h1>
      <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-slate">
        Le lien est peut-être obsolète, ou la ressource a été déplacée.
      </p>
      <Link href="/" className="mt-8">
        <Button>Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
