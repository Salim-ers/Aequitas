import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { MarketingCompliancePreview } from "@/components/marketing/mockups";
import { FaqJsonLd } from "@/components/marketing/structured-data";

export const metadata: Metadata = {
  title: "Facturation électronique",
  description:
    "Ce que la réforme de la facturation électronique change pour votre entreprise, ce que vous devez faire, et ce qu'Aequitas prend en charge à votre place.",
};

/**
 * §41 — Page pédagogique.
 * Le vocabulaire technique n'apparaît qu'en toute fin de page, replié.
 */

const TIMELINE = [
  {
    when: "Aujourd'hui",
    title: "Vous facturez comme d'habitude",
    body: "PDF par e-mail, courrier, ou logiciel. Rien ne vous est encore imposé.",
  },
  {
    when: "À l'entrée en vigueur",
    title: "Vous devez pouvoir recevoir des factures électroniques",
    body: "C'est la première marche, et elle concerne toutes les entreprises, quelle que soit leur taille.",
  },
  {
    when: "Par étapes ensuite",
    title: "Vous devez aussi les émettre sous forme électronique",
    body: "Le calendrier s'échelonne selon la taille de l'entreprise. Les petites structures sont concernées en dernier.",
  },
];

const WITH_AEQUITAS = [
  "Vous créez votre facture normalement, comme aujourd'hui",
  "Nous contrôlons les informations exigées avant l'envoi",
  "Nous préparons les données nécessaires à son traitement électronique",
  "Vous suivez le statut de la facture depuis le même écran",
];

const QUESTIONS = [
  {
    q: "Est-ce que ma petite entreprise est concernée ?",
    a: "Oui. La réforme concerne toutes les entreprises établies en France assujetties à la TVA, y compris les indépendants et les très petites structures. Seule la date à laquelle vous devrez émettre vos factures sous forme électronique dépend de votre taille.",
  },
  {
    q: "Est-ce que je peux continuer à envoyer un PDF par e-mail ?",
    a: "Pour vos factures entre entreprises, non : elles devront passer par une plateforme. C'est précisément ce dont Aequitas s'occupe. Vos factures à des particuliers ne sont pas concernées de la même manière.",
  },
  {
    q: "Est-ce que je dois apprendre un nouveau vocabulaire ?",
    a: "Non. Les termes techniques existent, mais ils restent du côté d'Aequitas. Dans l'interface, vous voyez « envoyer une facture » et « suivi de la facture », pas des sigles.",
  },
  {
    q: "Que se passe-t-il si une information manque sur ma facture ?",
    a: "Aequitas vous le signale avant l'envoi, en langage clair, avec le champ à compléter. Une facture incomplète n'est jamais envoyée à votre insu.",
  },
];

const TECHNICAL = [
  {
    term: "Modèle de facture unique",
    detail:
      "Chaque facture est stockée dans une structure pivot contenant vendeur, acheteur, lignes, ventilation de TVA et conditions de règlement. Les formats de sortie lisent cette structure, jamais la base directement.",
  },
  {
    term: "Factur-X",
    detail:
      "Un PDF lisible par un humain contenant les mêmes données sous forme structurée. Les deux représentations sont produites depuis la même source, ce qui interdit toute divergence entre ce qui est lu et ce qui est traité.",
  },
  {
    term: "UBL et CII",
    detail:
      "Deux adaptateurs distincts, alimentés par le même modèle. Ajouter un format ne modifie ni la saisie, ni le calcul, ni la base.",
  },
  {
    term: "Cycle de vie et e-reporting",
    detail:
      "Les changements d'état d'une facture transmise sont conservés et horodatés. Les données de reporting sont construites à partir des mêmes montants que ceux figurant sur la facture.",
  },
];

export default function EInvoicingPage() {
  return (
    <>
      <FaqJsonLd items={QUESTIONS} />

      {/* ————————————————— Ouverture ————————————————— */}
      <section>
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-14">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Facturation électronique</p>
              <h1 className="mt-3 text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.75rem]">
                Votre entreprise sera concernée par la réforme.
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
                Vous n&apos;avez pas besoin d&apos;en devenir expert. Aequitas centralise
                votre facturation et prépare progressivement les mécanismes nécessaires à
                son traitement dans le nouveau dispositif français.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/inscription" size="lg" className="w-full sm:w-auto">
                  Essayer gratuitement
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
            </div>

            <MarketingCompliancePreview />
          </div>
        </div>
      </section>

      {/* ————————————————— Le calendrier ————————————————— */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeader
            eyebrow="Le calendrier"
            title="Ce qui arrive, dans l'ordre."
            description="Les dates précises dépendent de la taille de votre entreprise et du calendrier retenu par l'administration. L'ordre des étapes, lui, ne change pas."
          />

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-3">
            {TIMELINE.map((step, index) => (
              <li key={step.when} className="bg-surface p-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.06em] text-blue">
                    {step.when}
                  </span>
                </div>
                <h3 className="mt-4 text-[16px] font-semibold leading-snug text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>

          <Alert
            tone="info"
            title="Rien ne se passe du jour au lendemain."
            className="mt-8"
          >
            La réforme s&apos;applique par étapes. Le rôle d&apos;un outil comme Aequitas
            est justement d&apos;absorber ces échéances pour que votre façon de
            travailler, elle, ne change pas.
          </Alert>
        </div>
      </section>

      {/* ————————————————— Avec Aequitas ————————————————— */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <SectionHeader eyebrow="En pratique" title="Avec Aequitas." />
              <ul className="mt-8 space-y-4">
                {WITH_AEQUITAS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-[15px] leading-relaxed text-ink-soft">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2">
              {[
                ["Préparation", "Les données de la facture, mises en forme pour vous."],
                ["Suivi de la facture", "Créée, préparée, envoyée, payée. En français."],
                ["Contrôles", "Les manques signalés avant l'envoi, pas après."],
                ["Transmission", "Activée selon l'avancement de l'infrastructure Aequitas."],
              ].map(([term, detail]) => (
                <div key={term} className="bg-surface p-5">
                  <dt className="text-[14px] font-semibold text-ink">{term}</dt>
                  <dd className="mt-1.5 text-[13px] leading-relaxed text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ——————————— Disponible, en cours, à venir ——————————— */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="display-3 text-ink">
              Ce qui est disponible, et ce qui ne l&apos;est pas encore.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              Cet état est tenu dans le code et partagé avec la page Tarifs : il ne peut
              pas rester en retard sur la réalité du produit.
            </p>
          </div>

          <dl className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-3">
            {[
              {
                state: "Disponible",
                tone: "success" as const,
                items: [
                  "Comptes, rôles et permissions",
                  "Isolation des données par entreprise",
                  "Journal d'audit",
                  "Calcul de TVA et numérotation",
                ],
              },
              {
                state: "En développement",
                tone: "blue" as const,
                items: [
                  "Écrans devis, factures et clients",
                  "Formats Factur-X, UBL et CII",
                  "Contrôles avant envoi",
                ],
              },
              {
                state: "Dépend de l'immatriculation",
                tone: "neutral" as const,
                items: [
                  "Transmission par un canal officiel",
                  "E-reporting réel",
                  "Interopérabilité entre plateformes",
                ],
              },
            ].map((group) => (
              <div key={group.state} className="bg-surface p-6">
                <dt>
                  <Badge tone={group.tone} dot>
                    {group.state}
                  </Badge>
                </dt>
                <dd>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="text-[14px] leading-relaxed text-ink-soft">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <ButtonLink href="/demarche-pa" variant="secondary" size="lg">
              Suivre notre démarche PA
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ————————————————— Questions ————————————————— */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
            Les questions que tout le monde se pose
          </h2>
          <dl className="mt-8 divide-y divide-[color:var(--color-line)] border-t border-line">
            {QUESTIONS.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="text-[15px] font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ——————————— Les détails techniques, repliés ——————————— */}
      <section>
        <div className="mx-auto max-w-3xl px-5 py-16">
          <details className="group rounded-[var(--radius-lg)] border border-line bg-surface">
            <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-[15px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              Voir les détails techniques
              <span
                className="text-[13px] font-normal text-blue transition-transform group-open:rotate-180"
                aria-hidden="true"
              >
                ▾
              </span>
            </summary>
            <div className="border-t border-line px-5 py-5">
              <p className="text-[13.5px] leading-relaxed text-muted">
                Cette section s&apos;adresse aux équipes techniques et aux cabinets
                comptables. Rien de ce qui suit n&apos;est nécessaire pour utiliser
                Aequitas.
              </p>
              <dl className="mt-6 space-y-5">
                {TECHNICAL.map((item) => (
                  <div key={item.term}>
                    <dt className="text-[14px] font-semibold text-ink">{item.term}</dt>
                    <dd className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 border-t border-line pt-4 text-[13px] leading-relaxed text-faint">
                Lorsqu&apos;un canal officiel de transmission n&apos;est pas encore
                raccordé, l&apos;interface l&apos;indique explicitement plutôt que de
                laisser croire à un envoi réel.
              </p>
              <Link
                href="/developers"
                className="mt-4 inline-flex items-center gap-1.5 py-1 text-[14px] font-semibold text-blue hover:underline"
              >
                Documentation pour les développeurs
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </details>

          {/* §42 — Formulation prudente tant que l'immatriculation n'est pas délivrée. */}
          <Alert tone="info" className="mt-8">
            Aequitas prépare son infrastructure en vue de son immatriculation en qualité
            de Plateforme Agréée. Les fonctionnalités réglementaires sont activées
            progressivement.
          </Alert>
        </div>
      </section>
    </>
  );
}
