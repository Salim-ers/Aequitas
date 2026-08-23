import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Banknote,
  FolderOpen,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/page-header";
import { RevealScript } from "@/components/marketing/reveal";
import {
  MarketingDashboardPreview,
  MarketingPaymentNotification,
  MarketingInvoiceCard,
  MarketingCompliancePreview,
} from "@/components/marketing/mockups";
import { InvoicePreview } from "@/components/marketing/invoice-preview";

/** §14 — Trois étapes, pas douze fonctionnalités interchangeables. */
const STEPS = [
  {
    n: "01",
    title: "Créez",
    body: "Ajoutez votre client et vos prestations. Les totaux et la TVA se calculent au fur et à mesure.",
  },
  {
    n: "02",
    title: "Envoyez",
    body: "Aequitas prépare la facture au bon format et l'envoie. Vous n'avez rien à paramétrer.",
  },
  {
    n: "03",
    title: "Suivez",
    body: "Vous voyez immédiatement si elle est envoyée, payée ou en retard. Sans relancer votre comptable.",
  },
];

/** §16 — Quatre besoins, pas une grille générique. */
const NEEDS = [
  {
    icon: FileText,
    eyebrow: "Facturez",
    title: "Des devis aux factures, sans ressaisie",
    body: "Un devis accepté devient une facture en un clic. La numérotation est continue, la TVA multi-taux calculée, les avoirs rectifient sans jamais réécrire l'original.",
    bullets: ["Devis et factures", "Avoirs", "Factures récurrentes", "Numérotation continue"],
  },
  {
    icon: Banknote,
    eyebrow: "Encaissez",
    title: "Savoir qui doit quoi, et depuis quand",
    body: "Chaque règlement, même partiel, s'affecte à ses factures et met le solde à jour. Les retards remontent d'eux-mêmes en haut de votre écran.",
    bullets: ["Paiements et soldes", "Échéances", "Relances", "Suivi des retards"],
  },
  {
    icon: FolderOpen,
    eyebrow: "Centralisez",
    title: "Un seul endroit, plus de tableur parallèle",
    body: "Clients, fournisseurs et documents vivent au même endroit que vos factures. Les conditions de règlement suivent le client, pas votre mémoire.",
    bullets: ["Clients", "Fournisseurs", "Documents", "Conditions par client"],
  },
  {
    icon: ShieldCheck,
    eyebrow: "Préparez la réforme",
    title: "La facturation électronique, prise en charge",
    body: "Aequitas contrôle les informations exigées avant l'envoi et vous montre où en est chaque facture. Vous continuez de facturer comme aujourd'hui.",
    bullets: ["Contrôles avant envoi", "Suivi des envois", "E-reporting", "Formats réglementaires"],
  },
];

/** §13 — Catégories de clientèle, jamais de faux logos. */
const AUDIENCES = [
  "Indépendants",
  "TPE",
  "PME",
  "Cabinets comptables",
  "ESN",
  "Agences",
];

export default function HomePage() {
  return (
    <>
      <RevealScript />

      {/* ————————————————————————— Hero ————————————————————————— */}
      <section className="relative overflow-hidden">
        {/* Halo bleu très dilué : donne de la profondeur sans colorer la page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_50%,var(--color-blue-soft),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 lg:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-border bg-blue-soft px-3 py-1 text-[12.5px] font-medium text-blue">
              <span className="size-1.5 rounded-full bg-red" aria-hidden="true" />
              Facturation électronique • France
            </span>

            <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.035em] text-ink sm:text-[3.5rem]">
              La facturation électronique,
              <br />
              <span className="text-blue">sans la complexité.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-muted">
              Créez vos devis, envoyez vos factures et suivez vos paiements depuis un
              seul espace. Aequitas vous accompagne aussi dans le passage à la
              facturation électronique.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/inscription" size="xl" className="w-full sm:w-auto">
                Essayer gratuitement
                <ArrowRight />
              </ButtonLink>
              <ButtonLink
                href="#comment-ca-marche"
                variant="secondary"
                size="xl"
                className="w-full sm:w-auto"
              >
                Voir comment ça marche
              </ButtonLink>
            </div>

            <p className="mt-5 text-[13px] text-faint">
              14 jours gratuits • Sans carte bancaire • Configuration en quelques minutes
            </p>
          </div>

          {/* §12 — Le produit, montré grand, avec deux cartes en surimpression. */}
          <div className="relative mx-auto mt-16 max-w-4xl">
            <MarketingDashboardPreview />
            <MarketingPaymentNotification className="reveal absolute -bottom-8 -left-6 hidden [--reveal-delay:220ms] md:flex lg:-left-24" />
            <MarketingInvoiceCard className="reveal absolute -right-6 -top-10 hidden [--reveal-delay:340ms] md:block lg:-right-20" />
          </div>
        </div>
      </section>

      {/* ——————————————————— Pour qui ——————————————————— */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <p className="text-center text-[13px] font-medium text-faint">
            Conçu pour les entreprises françaises
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {AUDIENCES.map((audience) => (
              <li
                key={audience}
                className="rounded-full border border-line bg-canvas px-4 py-1.5 text-[13.5px] font-medium text-ink-soft"
              >
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——————————————— Comment ça marche ——————————————— */}
      <section id="comment-ca-marche" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
          <SectionHeader
            align="center"
            eyebrow="En pratique"
            title="Facturez en trois étapes."
            description="Pas de paramétrage préalable, pas de vocabulaire à apprendre."
          />

          <ol className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-3">
            {STEPS.map((step) => (
              <li
                key={step.n}
                className="bg-surface p-7"
              >
                <span className="tabular text-[13px] font-semibold text-red">{step.n}</span>
                <h3 className="mt-3 text-[19px] font-semibold tracking-[-0.01em] text-ink">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <InvoicePreview />
            <div className="lg:pl-4">
              <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
                Les totaux se calculent pendant que vous saisissez.
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                Remises par ligne, TVA multi-taux, arrondis fiscaux : l&apos;échelle
                HT → TVA → TTC est tenue par Aequitas. Les montants de cet aperçu sont
                d&apos;ailleurs calculés par le moteur de TVA réellement utilisé par
                l&apos;application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ————————————————— La réforme ————————————————— */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <SectionHeader
                eyebrow="Réforme"
                title={
                  <>
                    La facturation électronique arrive.
                    <br />
                    <span className="text-muted">
                      Vous n&apos;avez pas besoin d&apos;en devenir expert.
                    </span>
                  </>
                }
              />

              <dl className="mt-10 space-y-6">
                {[
                  {
                    term: "Ce qui change",
                    detail:
                      "Les factures entre entreprises devront circuler sous forme électronique, par une plateforme, et non plus par simple e-mail.",
                  },
                  {
                    term: "Ce que vous devez faire",
                    detail:
                      "Disposer d'un outil raccordé et de fiches clients complètes. C'est tout : vous continuez de facturer comme aujourd'hui.",
                  },
                  {
                    term: "Ce qu'Aequitas prend en charge",
                    detail:
                      "Le format, les contrôles avant envoi, la transmission et le suivi de chaque facture, depuis le même écran.",
                  },
                ].map((item) => (
                  <div key={item.term} className="border-l-2 border-blue pl-4">
                    <dt className="text-[15px] font-semibold text-ink">{item.term}</dt>
                    <dd className="mt-1.5 text-[14px] leading-relaxed text-muted">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/facturation-electronique"
                className="mt-8 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-blue hover:underline"
              >
                Comprendre le calendrier
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="lg:pt-10">
              <MarketingCompliancePreview />
            </div>
          </div>
        </div>
      </section>

      {/* ————————————————— Les besoins ————————————————— */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-24">
          <SectionHeader
            align="center"
            eyebrow="Ce que vous faites avec Aequitas"
            title="Quatre besoins, un seul outil."
          />

          <div className="mt-16 space-y-20">
            {NEEDS.map((need, index) => (
              <div
                key={need.eyebrow}
                className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16"
              >
                {/* Alternance : le visuel change de côté à chaque bloc. */}
                <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                  <span className="inline-flex size-10 items-center justify-center rounded-[var(--radius)] bg-blue-soft text-blue">
                    <need.icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="eyebrow mt-4">{need.eyebrow}</p>
                  <h3 className="mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                    {need.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{need.body}</p>
                  <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                    {need.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-center gap-2 text-[14px] text-ink-soft"
                      >
                        <Check
                          className="size-4 shrink-0 text-blue"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : undefined}>
                  <NeedVisual index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————————————— La technique, derrière ————————————— */}
      <section className="border-t border-line bg-navy on-navy">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-white sm:text-[2.125rem]">
                La complexité technique reste derrière Aequitas.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
                Formats réglementaires, contrôles, transmissions, API : tout cela
                existe et fonctionne. Vous n&apos;avez simplement jamais besoin d&apos;y
                toucher.
              </p>
              <Link
                href="/developers"
                className="mt-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-white hover:underline"
              >
                Documentation pour les développeurs
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-white/10">
              {[
                ["Factur-X", "PDF lisible, données structurées embarquées."],
                ["UBL", "Rendu depuis le même modèle de facture."],
                ["CII", "Adaptateur distinct, données source identiques."],
                ["API", "Chaque action de l'interface est aussi une requête."],
              ].map(([term, detail]) => (
                <div key={term} className="bg-navy p-5">
                  <dt className="text-[14px] font-semibold text-white">{term}</dt>
                  <dd className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ————————————————— CTA final ————————————————— */}
      <section>
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.5rem]">
            Vos factures. Plus simples. Toujours prêtes.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-muted">
            Créez votre compte et envoyez votre première facture aujourd&apos;hui.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/inscription" size="xl" className="w-full sm:w-auto">
              Essayer gratuitement
              <ArrowRight />
            </ButtonLink>
            <ButtonLink
              href="/tarifs"
              variant="secondary"
              size="xl"
              className="w-full sm:w-auto"
            >
              Voir les tarifs
            </ButtonLink>
          </div>
          <p className="mt-5 text-[13px] text-faint">
            14 jours gratuits • Sans carte bancaire
          </p>
        </div>
      </section>
    </>
  );
}

/**
 * Aperçus produit des quatre besoins.
 * Volontairement schématiques : ils montrent une forme d'interface,
 * pas de fausses données présentées comme réelles.
 */
function NeedVisual({ index }: { index: number }) {
  const CONTENT = [
    {
      title: "Facture F-2026-0148",
      rows: [
        ["Prestation de conseil", "3 900,00 €"],
        ["Reprise des historiques", "2 160,00 €"],
        ["Maintenance — trimestre", "870,00 €"],
      ],
      footer: ["Total TTC", "8 316,00 €"],
    },
    {
      title: "Suivi des règlements",
      rows: [
        ["Delaunay & Associés", "Payée"],
        ["Atelier Verdier", "Échéance dans 6 j"],
        ["Groupe Marceau", "En retard de 12 j"],
      ],
      footer: ["Reste à encaisser", "8 420,00 €"],
    },
    {
      title: "Clients",
      rows: [
        ["Delaunay & Associés", "SIREN 812 445 903"],
        ["Atelier Verdier", "SIREN 519 220 774"],
        ["Groupe Marceau", "SIREN 447 901 328"],
      ],
      footer: ["Fiches complètes", "3 sur 3"],
    },
    {
      title: "Envois de la semaine",
      rows: [
        ["F-2026-0148", "Reçue"],
        ["F-2026-0147", "Envoyée"],
        ["F-2026-0146", "Contrôles passés"],
      ],
      footer: ["Envois sans erreur", "12 sur 12"],
    },
  ][index]!;

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-sm"
      aria-hidden="true"
    >
      <div className="border-b border-line px-5 py-3.5">
        <p className="text-[13px] font-semibold text-ink">{CONTENT.title}</p>
      </div>
      <ul>
        {CONTENT.rows.map((row, i) => (
          <li
            key={row[0]}
            className={`flex items-center justify-between gap-4 px-5 py-3 text-[13px] ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <span className="min-w-0 truncate text-ink-soft">{row[0]}</span>
            <span className="tabular shrink-0 font-medium text-muted">{row[1]}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between border-t border-line bg-surface-2/60 px-5 py-3.5">
        <span className="text-[12.5px] text-muted">{CONTENT.footer[0]}</span>
        <span className="tabular text-[15px] font-semibold text-ink">
          {CONTENT.footer[1]}
        </span>
      </div>
    </div>
  );
}
