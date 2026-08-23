import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Banknote,
  FolderOpen,
  ShieldCheck,
  KeyRound,
  UsersRound,
  ScrollText,
  Layers,
  FileCheck2,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PlanBullets } from "@/components/marketing/plan-bullets";
import { PLAN_ORDER, PLANS, formatPlanPrice } from "@/src/config/plans";
import { RevealScript } from "@/components/marketing/reveal";
import {
  MarketingDashboardPreview,
  MarketingDeliveryCard,
  MarketingPaymentNotification,
  MarketingCompliancePreview,
  MarketingPanel,
} from "@/components/marketing/mockups";
import {
  OrganizationJsonLd,
  SoftwareJsonLd,
  FaqJsonLd,
} from "@/components/marketing/structured-data";
import { HOME_FAQ } from "@/src/content/faq";
import { REFORM_TIMELINE, PLATFORM_ROLES } from "@/src/content/reform";
import { InfrastructureDiagram } from "@/components/marketing/infrastructure-diagram";
import { cn } from "@/src/lib/utils";

const AUDIENCES = ["Indépendants", "TPE", "PME", "Cabinets comptables", "ESN"];

const STEPS = [
  {
    n: "1",
    title: "Créez",
    body: "Choisissez votre client, ajoutez vos prestations et validez.",
    panel: {
      title: "Nouvelle facture",
      rows: [
        ["Prestation de conseil — 5 j", "3 900,00 €"],
        ["Reprise des historiques", "2 160,00 €"],
        ["TVA 20 %", "1 212,00 €"],
      ] as const,
      footer: ["Total TTC", "7 272,00 €"] as const,
    },
  },
  {
    n: "2",
    title: "Préparez",
    body: "Aequitas vérifie votre facture et prépare les données nécessaires à son traitement électronique.",
    panel: {
      title: "Contrôles",
      rows: [
        ["Informations entreprise", "Complètes"],
        ["Informations client", "Complètes"],
        ["Numérotation et TVA", "Conformes"],
      ] as const,
      footer: ["Prêt à envoyer", "3 sur 3"] as const,
    },
  },
  {
    n: "3",
    title: "Suivez",
    body: "Vous voyez immédiatement où en est votre facture.",
    panel: {
      title: "Suivi",
      rows: [
        ["F-2026-0148", "Payée"],
        ["F-2026-0147", "Envoyée"],
        ["F-2026-0146", "En retard"],
      ] as const,
      footer: ["Reste à encaisser", "8 420,00 €"] as const,
    },
  },
];

const BENEFITS = [
  {
    icon: FileText,
    eyebrow: "Facturez",
    title: "Des devis aux factures, sans ressaisie.",
    body: "Un devis accepté devient une facture en un clic. La numérotation reste continue, la TVA multi-taux est calculée pendant que vous saisissez, et les avoirs rectifient sans jamais réécrire l'original.",
    bullets: ["Devis et factures", "Avoirs", "Factures récurrentes", "Numérotation continue"],
    panel: {
      title: "Devis et factures",
      rows: [
        ["Devis D-2026-0042", "Accepté"],
        ["Converti en facture", "F-2026-0148"],
        ["Avoir A-2026-0007", "Rattaché"],
      ] as const,
      footer: ["Ce mois-ci", "12 documents"] as const,
    },
  },
  {
    icon: Banknote,
    eyebrow: "Encaissez",
    title: "Voyez immédiatement ce qui a été payé.",
    body: "Chaque règlement, même partiel, s'affecte à ses factures et met le solde à jour. Les retards remontent d'eux-mêmes en haut de votre écran, sans que vous ayez à les chercher.",
    bullets: ["Paiements et soldes", "Échéances", "Relances", "Suivi des retards"],
    panel: {
      title: "Règlements",
      rows: [
        ["Delaunay & Associés", "Payée"],
        ["Atelier Verdier", "Échéance dans 6 j"],
        ["Groupe Marceau", "En retard de 12 j"],
      ] as const,
      footer: ["Reste à encaisser", "8 420,00 €"] as const,
    },
  },
  {
    icon: FolderOpen,
    eyebrow: "Centralisez",
    title: "Clients, fournisseurs et documents au même endroit.",
    body: "Les conditions de règlement suivent le client, pas votre mémoire. Vos factures d'achat vivent à côté de vos factures de vente, et vos exports partent d'un seul endroit.",
    bullets: ["Clients", "Fournisseurs", "Documents", "Conditions par client"],
    panel: {
      title: "Clients",
      rows: [
        ["Delaunay & Associés", "SIREN 812 445 903"],
        ["Atelier Verdier", "SIREN 519 220 774"],
        ["Groupe Marceau", "SIREN 447 901 328"],
      ] as const,
      footer: ["Fiches complètes", "3 sur 3"] as const,
    },
  },
  {
    icon: ShieldCheck,
    eyebrow: "Préparez la réforme",
    title: "Votre facturation évolue sans bouleverser votre quotidien.",
    body: "Aequitas contrôle les informations attendues avant l'envoi et vous montre où en est chaque facture. Vous continuez de facturer exactement comme aujourd'hui.",
    bullets: [
      "Contrôles avant envoi",
      "Suivi des factures",
      "Fiches clients complètes",
      "Formats structurés",
    ],
    panel: null,
  },
];

const SECURITY = [
  {
    icon: KeyRound,
    title: "Accès sécurisé",
    body: "Authentification et gestion des sessions, révocables à tout moment.",
  },
  {
    icon: UsersRound,
    title: "Permissions",
    body: "Chaque utilisateur accède uniquement à ce dont il a besoin.",
  },
  {
    icon: ScrollText,
    title: "Traçabilité",
    body: "Les actions sensibles sont enregistrées et horodatées.",
  },
  {
    icon: Layers,
    title: "Isolation",
    body: "Les données de chaque organisation restent séparées.",
  },
];

/** Trois offres sur la home ; le comparatif complet vit sur /tarifs. */
const HOME_PLANS = PLAN_ORDER.filter((slug) => PLANS[slug].monthlyPriceCents !== null);

export default function HomePage() {
  return (
    <>
      <RevealScript />
      <OrganizationJsonLd />
      <SoftwareJsonLd />
      <FaqJsonLd items={HOME_FAQ} />

      {/* ————————————————————————— Hero ————————————————————————— */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-32 h-[28rem] bg-[radial-gradient(55%_60%_at_50%_50%,var(--color-blue-soft),transparent_72%)]"
        />

        <div className="relative mx-auto max-w-[var(--container-page)] px-5 pt-14 pb-16 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="eyebrow" data-hero-step>
              Facturation électronique • France
            </p>
            <span className="tricolore mx-auto mt-3" data-hero-step aria-hidden="true" />

            <h1 className="display-1 mt-6 text-ink" data-hero-step>
              La plateforme française
              <br />
              <span className="text-blue">de facturation électronique.</span>
            </h1>

            <p className="lead mx-auto mt-6 max-w-2xl" data-hero-step>
              Créez vos factures comme aujourd&apos;hui. Aequitas s&apos;occupe de la
              complexité de demain.
            </p>

            <div
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              data-hero-step
            >
              <ButtonLink href="/inscription" size="2xl" className="w-full sm:w-auto">
                Créer mon compte
                <ArrowRight />
              </ButtonLink>
              <ButtonLink
                href="#produit"
                variant="secondary"
                size="2xl"
                className="w-full sm:w-auto"
              >
                Découvrir la plateforme
              </ButtonLink>
            </div>

            <p
              className="mt-6 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 text-[13.5px] text-ink-soft"
              data-hero-step
            >
              <span className="tricolore w-7 shrink-0" aria-hidden="true" />
              Conçu en France pour accompagner les entreprises dans la réforme 2026–2027.
            </p>

            <p className="mt-5 text-[13.5px] text-faint" data-hero-step>
              14 jours gratuits • Sans carte bancaire • Mise en route en quelques minutes
            </p>
          </div>

          {/* Le produit, montré grand, avec deux surimpressions au maximum. */}
          <div className="relative mx-auto mt-14 max-w-5xl" data-hero-step>
            <MarketingDashboardPreview />
            <MarketingDeliveryCard className="reveal absolute -left-8 bottom-0 hidden translate-y-1/2 [--reveal-delay:260ms] xl:flex" />
            <MarketingPaymentNotification className="reveal absolute -right-8 bottom-0 hidden translate-y-1/2 [--reveal-delay:400ms] xl:flex" />
          </div>
        </div>
      </section>

      {/* ——————————————————— Signal français ——————————————————— */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-12 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <span className="tricolore" aria-hidden="true" />
            <p className="mt-4 text-[17px] font-semibold text-ink">
              Pensé pour les entreprises françaises.
            </p>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {AUDIENCES.map((audience) => (
                <li key={audience} className="text-[14.5px] font-medium text-muted">
                  {audience}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ————————————————— La réforme ————————————————— */}
      <section id="reforme" className="scroll-mt-28 border-b border-line bg-blue-soft/40">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow">Réforme 2026 — 2027</p>
            <h2 className="display-2 mt-3 text-ink">
              La facturation électronique change.
              <br />
              <span className="text-muted">
                Votre façon de travailler n&apos;a pas à changer.
              </span>
            </h2>
            <p className="lead mt-5">
              À partir de septembre 2026, la facturation électronique se généralise
              progressivement en France. Aequitas absorbe ces échéances pour vous.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 lg:grid-cols-2">
            {REFORM_TIMELINE.map((milestone) => (
              <li
                key={milestone.date}
                className="reveal rounded-[var(--radius-xl)] border border-line bg-surface p-7"
              >
                <div className="flex items-center gap-3">
                  <span className="tabular text-[15px] font-semibold text-navy">
                    {milestone.date}
                  </span>
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                </div>

                <dl className="mt-5 space-y-5">
                  {milestone.entries.map((entry) => (
                    <div key={entry.who}>
                      <dt className="text-[16px] font-semibold text-ink">{entry.who}</dt>
                      <dd className="mt-1 text-[14.5px] leading-relaxed text-muted">
                        {entry.what}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <ButtonLink href="/facturation-electronique" variant="secondary" size="lg">
              Comprendre la réforme
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ————————————— Comment ça fonctionne ————————————— */}
      <section id="produit" className="scroll-mt-28 border-b border-line">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="display-2 text-ink">
              Vous facturez.
              <br />
              <span className="text-muted">Aequitas s&apos;occupe du reste.</span>
            </h2>
          </div>

          <ol className="mt-14 grid gap-8 lg:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="reveal">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-semibold text-white">
                    {step.n}
                  </span>
                  <h3 className="text-[19px] font-semibold tracking-[-0.015em] text-ink">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{step.body}</p>
                <MarketingPanel
                  className="mt-6"
                  title={step.panel.title}
                  rows={step.panel.rows}
                  footer={step.panel.footer}
                />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————————————— Le tableau de bord ————————————— */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <div>
              <h2 className="display-2 text-ink">Tout ce qui compte, dès l&apos;ouverture.</h2>
              <p className="lead mt-5">
                Votre tableau de bord vous indique immédiatement ce qui est encaissé, ce
                qui reste à recevoir et les actions à effectuer.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { label: "Encaissé", value: "24 850 €", tone: "text-ink" },
                  { label: "À recevoir", value: "8 420 €", tone: "text-ink" },
                  { label: "En retard", value: "1 350 €", tone: "text-danger" },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-[var(--radius-lg)] border border-line bg-canvas px-4 py-3.5"
                  >
                    <p className="text-[12px] uppercase tracking-[0.06em] text-faint">
                      {kpi.label}
                    </p>
                    <p
                      className={cn(
                        "tabular mt-1.5 text-[22px] font-semibold tracking-tight",
                        kpi.tone,
                      )}
                    >
                      {kpi.value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 rounded-[var(--radius)] border border-warning-border bg-warning-soft px-4 py-3 text-[14px] font-medium text-warning">
                3 factures nécessitent votre attention
              </p>
            </div>

            <div className="reveal">
              <MarketingDashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ————————————————— Les bénéfices ————————————————— */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="space-y-24">
            {BENEFITS.map((benefit, index) => (
              <div
                key={benefit.eyebrow}
                className="reveal grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20"
              >
                {/* Alternance : le visuel change de côté à chaque bloc. */}
                <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                  <span className="inline-flex size-11 items-center justify-center rounded-[var(--radius)] bg-blue-soft text-blue">
                    <benefit.icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="eyebrow mt-5">{benefit.eyebrow}</p>
                  <h3 className="display-3 mt-2.5 text-ink">{benefit.title}</h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-muted">{benefit.body}</p>
                  <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                    {benefit.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-center gap-2.5 text-[15px] text-ink-soft"
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
                  {benefit.panel ? (
                    <MarketingPanel
                      title={benefit.panel.title}
                      rows={benefit.panel.rows}
                      footer={benefit.panel.footer}
                    />
                  ) : (
                    <MarketingCompliancePreview />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——————————— Infrastructure française ——————————— */}
      <section className="on-navy border-b border-line bg-navy">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.09em] text-white/60">
              Infrastructure française
            </p>
            <span className="tricolore mx-auto mt-4" aria-hidden="true" />
            <h2 className="display-2 mt-6 text-white">
              Au cœur de la nouvelle facturation électronique française.
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-white/70">
              Le nouveau dispositif repose sur des plateformes spécialisées capables
              d&apos;échanger les factures électroniques et de transmettre les données
              prévues à l&apos;administration.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-white/70">
              Aequitas développe son infrastructure en vue de son immatriculation en
              qualité de Plateforme Agréée.
            </p>
          </div>

          <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
            <InfrastructureDiagram />

            <div>
              {/* Badge propriétaire Aequitas — jamais le logo officiel PA. */}
              <div className="inline-flex items-start gap-3 rounded-[var(--radius-lg)] border border-white/15 bg-white/5 px-4 py-3.5">
                <FileCheck2
                  className="mt-0.5 size-5 shrink-0 text-white/70"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-[14.5px] font-semibold text-white">Démarche PA</p>
                  <p className="text-[13px] text-white/60">Infrastructure en préparation</p>
                </div>
              </div>

              <h3 className="display-3 mt-10 text-white">
                Pourquoi les Plateformes Agréées sont-elles importantes ?
              </h3>

              <dl className="mt-8 space-y-6">
                {PLATFORM_ROLES.map((role, index) => (
                  <div key={role.title} className="flex gap-4">
                    <span
                      className="tabular shrink-0 text-[13px] font-semibold text-white/40"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <dt className="text-[16px] font-semibold text-white">{role.title}</dt>
                      <dd className="mt-1.5 text-[14.5px] leading-relaxed text-white/65">
                        {role.body}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <p className="mt-8 border-t border-white/10 pt-6 text-[15px] leading-relaxed text-white/70">
                Aequitas est développée pour s&apos;inscrire dans ce fonctionnement.
              </p>

              <Link
                href="/demarche-pa"
                className="mt-5 inline-flex items-center gap-1.5 py-1 text-[15px] font-semibold text-white hover:underline"
              >
                Suivre notre démarche PA
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ————————— Ce qui est prêt, et ce qui ne l'est pas ————————— */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-20 lg:py-24">
          <h2 className="display-3 text-ink">Ce qui est prêt, et ce qui ne l&apos;est pas.</h2>
          <p className="lead mt-5">
            Aequitas est développée autour des formats, contrôles et mécanismes
            d&apos;interopérabilité nécessaires à la facturation électronique.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            Les fonctionnalités sont activées progressivement au fur et à mesure de
            l&apos;avancement technique et réglementaire. Vous pouvez consulter à tout
            moment l&apos;état exact de chaque brique.
          </p>
          <div className="mt-8">
            <ButtonLink href="/demarche-pa" variant="secondary" size="lg">
              Voir où en est Aequitas
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ————————— Pour les équipes techniques ————————— */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-20">
            <div>
              <p className="eyebrow">Pour les équipes techniques</p>
              <h2 className="display-3 mt-3 text-ink">
                Nous gérons les standards. Vous gérez votre activité.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-muted">
                Aequitas s&apos;appuie sur les standards de la facturation électronique
                afin qu&apos;ils restent invisibles pour les utilisateurs au quotidien.
              </p>
              <Link
                href="/developers"
                className="mt-6 inline-flex items-center gap-1.5 py-1 text-[15px] font-semibold text-blue hover:underline"
              >
                Voir la documentation technique
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <ul className="flex flex-wrap gap-2.5">
              {["Factur-X", "UBL", "CII", "API"].map((badge) => (
                <li
                  key={badge}
                  className="rounded-[var(--radius)] border border-line bg-surface px-4 py-2.5 font-mono text-[13.5px] text-ink-soft"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ————————————————— Sécurité ————————————————— */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="display-2 text-ink">Conçue pour des données qui comptent.</h2>
          </div>

          <dl className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map((item) => (
              <div key={item.title}>
                <span className="inline-flex size-10 items-center justify-center rounded-[var(--radius)] bg-blue-soft text-blue">
                  <item.icon className="size-4" aria-hidden="true" />
                </span>
                <dt className="mt-4 text-[17px] font-semibold text-ink">{item.title}</dt>
                <dd className="mt-2 text-[14.5px] leading-relaxed text-muted">{item.body}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <ButtonLink href="/securite" variant="secondary">
              Voir les mesures en place
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ————————————————— Tarifs ————————————————— */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <h2 className="display-2 text-ink">Un prix par mois, par entreprise.</h2>
            <p className="lead mt-5">
              Tous les montants sont hors taxes. Essai de 14 jours sur chaque offre, sans
              carte bancaire.
            </p>
          </div>

          <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
            {HOME_PLANS.map((slug) => {
              const plan = PLANS[slug];
              return (
                <div
                  key={plan.slug}
                  className={cn(
                    "relative flex h-full flex-col rounded-[var(--radius-xl)] border bg-surface p-7",
                    plan.highlighted ? "border-navy shadow-lg" : "border-line",
                  )}
                >
                  {plan.highlighted ? (
                    <span className="absolute -top-3 left-7 rounded-full bg-navy px-2.5 py-1 text-[11px] font-semibold text-white">
                      Recommandé
                    </span>
                  ) : null}

                  <h3 className="text-[19px] font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-4 flex items-baseline gap-1.5">
                    <span className="tabular text-[2.25rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                      {formatPlanPrice(plan)}
                    </span>
                    <span className="text-[13.5px] text-muted">HT / mois</span>
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted">{plan.tagline}</p>

                  <PlanBullets bullets={plan.bullets} limit={4} className="mt-6 flex-1" />
                </div>
              );
            })}
          </div>

          <div className="mt-10">
            <ButtonLink href="/tarifs" variant="secondary" size="lg">
              Voir tous les tarifs
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ————————————————— FAQ ————————————————— */}
      <section id="faq" className="scroll-mt-28 border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-20 lg:py-24">
          <h2 className="display-2 text-ink">Questions fréquentes</h2>
          <dl className="mt-10 divide-y divide-[color:var(--color-line)] border-t border-line">
            {HOME_FAQ.map((item) => (
              <div key={item.q} className="py-6">
                <dt className="text-[17px] font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ————————————————— CTA final ————————————————— */}
      <section className="on-navy bg-navy">
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-24 text-center">
          <h2 className="display-2 text-white">
            Préparez votre entreprise à la facturation électronique.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/70">
            Commencez dès aujourd&apos;hui à centraliser vos factures et vos clients avec
            Aequitas.
          </p>
          <div className="mt-9 flex justify-center">
            <ButtonLink href="/inscription" variant="inverse" size="2xl">
              Créer mon compte
              <ArrowRight />
            </ButtonLink>
          </div>
          <p className="mt-5 text-[13.5px] text-white/50">
            14 jours gratuits • Sans carte bancaire
          </p>
        </div>
      </section>
    </>
  );
}
