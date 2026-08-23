import type { Metadata } from "next";
import { ArrowRight, Check, FileText, Banknote, FolderOpen, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description:
    "Devis, factures, avoirs, clients, paiements et facturation électronique : ce qu'Aequitas fait pour votre entreprise.",
};

/** §16 — Les fonctionnalités se lisent par besoin, pas par module technique. */
const NEEDS = [
  {
    icon: FileText,
    title: "Facturez",
    intro:
      "Du devis envoyé à la facture émise, sans jamais ressaisir les mêmes informations.",
    items: [
      ["Devis", "Suivi de l'acceptation, puis conversion en facture en un clic."],
      ["Factures", "HT, remises, TVA par taux et reste à payer calculés en direct."],
      ["Avoirs", "Rattachés à la facture qu'ils rectifient, sans réécrire l'original."],
      ["Numérotation", "Séquence continue et sans trou, comme l'exige la réglementation."],
    ],
  },
  {
    icon: Banknote,
    title: "Encaissez",
    intro: "Savoir en permanence qui doit quoi, et depuis combien de temps.",
    items: [
      ["Paiements", "Règlements partiels ou multiples, affectés à une ou plusieurs factures."],
      ["Échéances", "Conditions de règlement portées par le client, pas par votre mémoire."],
      ["Relances", "Avant échéance, le jour J, ou en retard : le rythme est le vôtre."],
      ["Retards", "Remontés d'eux-mêmes en haut de votre vue d'ensemble."],
    ],
  },
  {
    icon: FolderOpen,
    title: "Centralisez",
    intro: "Un seul endroit, pour ne plus tenir de tableur en parallèle.",
    items: [
      ["Clients", "SIREN, SIRET, TVA intracommunautaire et conditions de règlement."],
      ["Fournisseurs", "Factures d'achat déposées, rapprochées et suivies au même endroit."],
      ["Catalogue", "Articles et prestations avec leur taux de TVA par défaut."],
      ["Exports", "CSV et PDF, pour votre comptable ou vos archives."],
    ],
  },
  {
    icon: ShieldCheck,
    title: "Préparez la réforme",
    intro: "La facturation électronique, prise en charge sans que vous ayez à l'apprendre.",
    items: [
      ["Contrôles", "Les informations manquantes signalées avant l'envoi, pas après."],
      ["Envoi", "Le format attendu par le destinataire est choisi pour vous."],
      ["Suivi", "Créée, envoyée, reçue, payée : en français, sur le même écran."],
      ["E-reporting", "Construit depuis vos factures, sans nouvelle saisie."],
    ],
  },
];

const ORGANISATION = [
  ["Rôles et permissions", "Six rôles, vérifiés côté serveur à chaque requête."],
  ["Journal d'audit", "Chaque action sensible horodatée et conservée."],
  ["API et webhooks", "Chaque action de l'interface est aussi une requête."],
];

export default function FeaturesPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-16">
          <SectionHeader
            eyebrow="Produit"
            title="Tout votre cycle de facturation."
            as="h1"
            description="Aequitas couvre le cycle commercial d'une entreprise française, de la proposition envoyée au règlement encaissé."
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-5xl px-5 py-16">
          <div className="space-y-14">
            {NEEDS.map((need) => (
              <div key={need.title}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--radius)] bg-blue-soft text-blue">
                    <need.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
                      {need.title}
                    </h2>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted">
                      {need.intro}
                    </p>
                  </div>
                </div>

                <dl className="mt-6 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
                  {need.items.map(([term, detail]) => (
                    <div key={term} className="bg-surface p-5">
                      <dt className="flex items-center gap-2 text-[14.5px] font-semibold text-ink">
                        <Check
                          className="size-4 shrink-0 text-blue"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        {term}
                      </dt>
                      <dd className="mt-1.5 pl-6 text-[13.5px] leading-relaxed text-muted">
                        {detail}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-16 border-t border-line pt-12">
            <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
              Et pour l&apos;entreprise
            </h2>
            <dl className="mt-6 grid gap-6 sm:grid-cols-3">
              {ORGANISATION.map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-[14.5px] font-semibold text-ink">{term}</dt>
                  <dd className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* §58 — L'état réel du produit est dit, pas suggéré. */}
          <Alert tone="info" title="Ouverture progressive" className="mt-12">
            Les modules sont activés par vagues. Votre espace indique en permanence ce qui
            est disponible pour votre entreprise, et rien n&apos;y est proposé qui ne
            fonctionne pas.
          </Alert>

          <div className="mt-12 flex flex-col items-center gap-3 border-t border-line pt-12 sm:flex-row sm:justify-center">
            <ButtonLink href="/inscription" size="lg" className="w-full sm:w-auto">
              Essayer gratuitement
              <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/tarifs" variant="secondary" size="lg" className="w-full sm:w-auto">
              Voir les tarifs
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
