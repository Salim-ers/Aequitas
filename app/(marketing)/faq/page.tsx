import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { HOME_FAQ } from "@/src/content/faq";
import { FaqJsonLd } from "@/components/marketing/structured-data";
import { FaqAccordion } from "@/components/marketing/faq-accordion";

export const metadata: Metadata = {
  title: "Questions fréquentes",
  description:
    "Ce qu'est la facturation électronique, qui est concerné, à partir de quand, et où en est Aequitas dans sa démarche d'immatriculation.",
};

/**
 * La home n'affiche que les quatre premières questions : elle ne doit pas
 * finir comme une page de support. Les six vivent ici, depuis la même source.
 */
export default function FaqPage() {
  return (
    <>
      <FaqJsonLd items={HOME_FAQ} />

      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-20">
          <p className="eyebrow">Questions fréquentes</p>
          <span className="tricolore mt-4" aria-hidden="true" />
          <h1 className="display-2 mt-6 text-ink">Ce que vous nous demandez le plus.</h1>
          <p className="lead mt-6">
            La réforme, votre situation, et l&apos;état exact d&apos;Aequitas. Sans
            détour.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-20">
          <FaqAccordion items={HOME_FAQ} />

          <div className="card-3d mt-14 rounded-[24px] p-8">
            <h2 className="text-[19px] font-semibold text-ink">
              Votre question n&apos;est pas là ?
            </h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
              Écrivez-nous : nous répondons sous deux jours ouvrés. Pour tout ce qui
              touche à notre statut réglementaire, la page dédiée détaille où nous en
              sommes, brique par brique.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact" size="lg" className="w-full sm:w-auto">
                Nous écrire
                <ArrowRight />
              </ButtonLink>
              <ButtonLink
                href="/demarche-pa"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Suivre notre démarche PA
              </ButtonLink>
            </div>
          </div>

          <p className="mt-10 text-[13.5px] leading-relaxed text-faint">
            Pour comprendre la réforme en détail,{" "}
            <Link
              href="/facturation-electronique"
              className="font-medium text-blue hover:underline"
            >
              consultez la page dédiée
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
