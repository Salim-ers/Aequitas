import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Circle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { PLATFORM_STATUS } from "@/src/content/status";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = {
  title: "Démarche PA",
  description:
    "Où en est Aequitas dans la préparation de son infrastructure en vue d'une candidature à l'immatriculation en qualité de Plateforme Agréée.",
};

/**
 * Page de transparence sur le statut réglementaire.
 *
 * Règle absolue : tant que l'immatriculation n'est pas délivrée, aucune
 * formulation ne doit laisser croire à un agrément, à une certification ou
 * à une affiliation avec l'administration. Le mot « Agréée » n'apparaît que
 * pour décrire le statut visé, jamais pour qualifier Aequitas.
 */

const NEVER = [
  "Agréée par l'État",
  "Certifiée DGFiP",
  "Partenaire de l'administration",
  "Solution officielle",
];

export default function PaProcessPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-16">
          <p className="eyebrow">Démarche PA</p>
          <span className="tricolore mt-3" aria-hidden="true" />
          <h1 className="display-2 mt-5 text-ink">Notre démarche Plateforme Agréée.</h1>
          <p className="lead mt-5">
            Aequitas est développée avec l&apos;objectif de rejoindre l&apos;écosystème
            français des Plateformes Agréées.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Cette page existe pour une raison simple : dans un domaine réglementé, une
            formulation floue est une forme de mensonge. Voici donc ce qui est fait, ce
            qui est en cours, et ce qui ne l&apos;est pas.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-14">
          <Alert tone="info" title="Aequitas n'est pas Plateforme Agréée">
            Aequitas prépare son infrastructure en vue d&apos;une candidature à
            l&apos;immatriculation en qualité de Plateforme Agréée auprès de
            l&apos;administration fiscale. Ce statut n&apos;est pas acquis et ne sera
            affiché qu&apos;après avoir été officiellement délivré.
          </Alert>

          <h2 className="display-3 mt-14 text-ink">Où en est Aequitas ?</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Ces états sont tenus dans le code, dans un fichier unique que la page
            Tarifs lit également. Ils ne peuvent donc pas se contredire, ni rester en
            retard sur la réalité du produit.
          </p>

          <ol className="mt-8">
            {PLATFORM_STATUS.map((step, index) => (
              <li key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                      step.state === "available" && "border-success bg-success text-white",
                      step.state === "in-progress" && "border-blue bg-blue-soft text-blue",
                      step.state === "soon" && "border-line-strong bg-surface",
                    )}
                  >
                    {step.state === "available" ? (
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    ) : step.state === "in-progress" ? (
                      <Circle className="size-2 fill-current" aria-hidden="true" />
                    ) : null}
                  </span>
                  {index < PLATFORM_STATUS.length - 1 ? (
                    <span
                      className={cn(
                        "w-0.5 flex-1",
                        step.state === "available" ? "bg-success/30" : "bg-line",
                      )}
                    />
                  ) : null}
                </div>

                <div className={cn("min-w-0", index < PLATFORM_STATUS.length - 1 && "pb-8")}>
                  <p className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={cn(
                        "text-[16px] font-semibold",
                        step.state === "soon" ? "text-faint" : "text-ink",
                      )}
                    >
                      {step.label}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        step.state === "available" && "bg-success-soft text-success",
                        step.state === "in-progress" && "bg-blue-soft text-blue",
                        step.state === "soon" && "bg-surface-2 text-faint",
                      )}
                    >
                      {step.state === "available"
                        ? "Disponible"
                        : step.state === "in-progress"
                          ? "En développement"
                          : "En préparation"}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="display-3 mt-16 text-ink">Ce que nous n&apos;écrirons pas</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Tant que l&apos;immatriculation n&apos;est pas délivrée, ces formulations
            n&apos;apparaîtront nulle part sur ce site, même sous forme suggérée :
          </p>
          {/* Marqué pour que le contrôle e2e des promesses ignore cette
              liste : elle cite les formulations proscrites pour les exclure. */}
          <ul className="mt-5 flex flex-wrap gap-2.5" data-claims-blocklist>
            {NEVER.map((claim) => (
              <li
                key={claim}
                className="rounded-[var(--radius)] border border-line bg-surface-2 px-3.5 py-2 text-[13.5px] text-faint line-through"
              >
                {claim}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            Aequitas n&apos;affiche par ailleurs aucun bloc marque institutionnel, ni
            emblème de la République, ni logo de l&apos;administration. Le filet
            tricolore utilisé sur ce site est un élément graphique propre à Aequitas :
            il indique une conception française, pas une approbation.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Lorsque l&apos;application produit un document dans un environnement qui
            n&apos;est raccordé à aucun canal officiel, elle l&apos;indique explicitement.
            Vous ne verrez jamais « Envoyé à l&apos;administration » si l&apos;envoi
            n&apos;a pas réellement eu lieu.
          </p>

          <h2 className="display-3 mt-16 text-ink">Ce que cela change pour vous</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Rien, dans l&apos;immédiat, sur votre façon de facturer : devis, factures,
            avoirs, clients et règlements fonctionnent indépendamment de ce statut. Les
            fonctionnalités qui en dépendent seront activées progressivement, et votre
            espace indique en permanence ce qui est disponible pour votre entreprise.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/facturation-electronique" size="lg" className="w-full sm:w-auto">
              Comprendre la réforme
              <ArrowRight />
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Poser une question
            </ButtonLink>
          </div>

          <p className="mt-10 border-t border-line pt-5 text-[13px] leading-relaxed text-faint">
            Cette page est mise à jour au fil de l&apos;avancement. Pour toute question
            sur notre statut réglementaire,{" "}
            <Link href="/contact" className="font-medium text-blue hover:underline">
              écrivez-nous
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
