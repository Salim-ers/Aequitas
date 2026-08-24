import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  UsersRound,
  ScrollText,
  Layers,
  FileCheck2,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PLAN_ORDER, PLANS, formatPlanPrice } from "@/src/config/plans";
import { PlanBullets } from "@/components/marketing/plan-bullets";
import { RevealScript } from "@/components/marketing/reveal";
import { DashboardMockup, TreasuryMockup } from "@/components/marketing/mockups";
import { ProductBento } from "@/components/marketing/bento";
import {
  OrganizationJsonLd,
  SoftwareJsonLd,
  FaqJsonLd,
} from "@/components/marketing/structured-data";
import { HOME_FAQ } from "@/src/content/faq";
import { REFORM_TIMELINE, PLATFORM_ROLES } from "@/src/content/reform";
import { cn } from "@/src/lib/utils";

const AUDIENCES = ["Indépendants", "TPE", "PME", "Cabinets comptables", "ESN"];

const SECURITY = [
  { icon: KeyRound, title: "Accès sécurisé", body: "Authentification et sessions révocables." },
  { icon: UsersRound, title: "Permissions", body: "Chacun accède à ce dont il a besoin." },
  { icon: ScrollText, title: "Traçabilité", body: "Les actions sensibles sont enregistrées." },
  { icon: Layers, title: "Isolation", body: "Les données de chaque entreprise restent séparées." },
];

const HOME_PLANS = PLAN_ORDER.filter((slug) => PLANS[slug].monthlyPriceCents !== null);

/** Quatre questions ici ; le reste vit sur /faq. */
const FAQ_ON_HOME = HOME_FAQ.slice(0, 4);

export default function HomePage() {
  return (
    <>
      <RevealScript />
      <OrganizationJsonLd />
      <SoftwareJsonLd />
      <FaqJsonLd items={HOME_FAQ} />

      {/* ————————————————————————— Hero —————————————————————————
          Deux colonnes : le texte et la maquette tiennent dans une seule
          fenêtre, sans que le produit soit coupé par le bas. */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-blue-soft via-blue-soft/40 to-canvas">
        <div className="relative mx-auto max-w-[var(--container-page)] px-5 pt-10 pb-14 lg:px-8 lg:pt-12 lg:pb-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
            <div className="min-w-0">
              <p className="eyebrow" data-hero-step>
                Facturation électronique • France
              </p>
              <span className="tricolore mt-3.5" data-hero-step aria-hidden="true" />

              <h1 className="display-1 mt-4 text-ink" data-hero-step>
                La plateforme française de{" "}
                <span className="text-blue">facturation électronique.</span>
              </h1>

              <p className="lead mt-4 max-w-lg" data-hero-step>
                Créez vos factures comme aujourd&apos;hui. Aequitas simplifie la réforme
                française et prépare votre transition.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row" data-hero-step>
                <ButtonLink href="/inscription" size="xl" className="w-full sm:w-auto">
                  Créer mon compte
                  <ArrowRight />
                </ButtonLink>
                <ButtonLink
                  href="#produit"
                  variant="secondary"
                  size="xl"
                  className="w-full sm:w-auto"
                >
                  Découvrir la plateforme
                </ButtonLink>
              </div>

              <p className="mt-4 text-[13px] text-faint" data-hero-step>
                14 jours gratuits • Sans carte bancaire • Mise en route en quelques minutes
              </p>
            </div>

            <div className="min-w-0" data-hero-step>
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ——————————————————— Signal France ——————————————————— */}
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-[var(--container-page)] flex-col items-center px-5 py-14 text-center lg:px-8">
          <span className="tricolore" aria-hidden="true" />
          <p className="mt-5 text-[18px] font-semibold tracking-[-0.01em] text-ink">
            Conçu en France pour les entreprises françaises.
          </p>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {AUDIENCES.map((audience) => (
              <li key={audience} className="text-[15px] font-medium text-muted">
                {audience}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————————————————— La réforme ————————————————— */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Réforme 2026 — 2027</p>
            <h2 className="display-2 mt-4 text-ink">
              La facturation électronique change.
              <br />
              <span className="text-muted">Pas votre façon de travailler.</span>
            </h2>
          </div>

          <ol className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
            {REFORM_TIMELINE.map((milestone, index) => (
              <li
                key={milestone.date}
                className="reveal rounded-[18px] border border-line bg-surface p-8"
                style={{ ["--reveal-delay" as string]: `${index * 120}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-[13px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <span className="tabular text-[16px] font-semibold text-navy">
                    {milestone.date}
                  </span>
                </div>

                <dl className="mt-6 space-y-5 border-t border-line pt-6">
                  {milestone.entries.map((entry) => (
                    <div key={entry.who}>
                      <dt className="text-[16px] font-semibold text-ink">{entry.who}</dt>
                      <dd className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
                        {entry.what}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-14 flex max-w-4xl flex-col items-center gap-6 text-center">
            <p className="display-3 text-navy">Aequitas vous prépare dès maintenant.</p>
            <ButtonLink href="/facturation-electronique" variant="secondary" size="lg">
              Comprendre la réforme
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ————————————— Grand bloc produit ————————————— */}
      <section id="produit" className="scroll-mt-28 border-b border-line bg-canvas">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-24">
            <div className="min-w-0">
              <h2 className="display-2 text-ink">Tout votre pilotage au même endroit.</h2>
              <p className="lead mt-6">
                Ce qui est encaissé, ce qui reste à recevoir, ce qui traîne. En une seule
                vue, dès l&apos;ouverture.
              </p>

              <dl className="mt-10 space-y-6">
                {[
                  ["Encaissements", "Le total réglé, mois par mois."],
                  ["Factures à envoyer", "Ce qui attend encore votre validation."],
                  ["Retards", "Remontés en haut, pas enfouis dans une liste."],
                  ["Activité récente", "Les derniers mouvements, sans chercher."],
                ].map(([term, detail]) => (
                  <div key={term} className="border-l-2 border-blue pl-5">
                    <dt className="text-[17px] font-semibold text-ink">{term}</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed text-muted">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="reveal min-w-0">
              <TreasuryMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ————————————— Grille produit ————————————— */}
      <ProductBento
        cta={
          <ButtonLink href="/fonctionnalites" variant="inverse" size="lg">
            Voir toutes les fonctionnalités
            <ArrowRight />
          </ButtonLink>
        }
      />

      {/* ——————————— Infrastructure française ——————————— */}
      <section className="border-b border-line bg-blue-soft/45">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-blue">
              Infrastructure française
            </p>
            <span className="tricolore mx-auto mt-5" aria-hidden="true" />
            <h2 className="display-2 mt-7 text-ink">
              Construite pour la nouvelle architecture de facturation électronique.
            </h2>
            <p className="lead mt-6">
              Le dispositif français repose sur des plateformes spécialisées. Aequitas
              développe son infrastructure en vue de son immatriculation.
            </p>

            <div className="mt-9 inline-flex items-center gap-3 rounded-full border border-blue-border bg-surface px-5 py-2.5">
              <FileCheck2 className="size-4 shrink-0 text-blue" aria-hidden="true" />
              <span className="text-[14px] font-semibold text-navy">Démarche PA</span>
              <span className="size-1 rounded-full bg-line-strong" aria-hidden="true" />
              <span className="text-[14px] text-muted">En préparation</span>
            </div>
          </div>

          <dl className="mx-auto mt-16 grid max-w-4xl gap-x-12 gap-y-10 sm:grid-cols-3">
            {PLATFORM_ROLES.map((role, index) => (
              <div key={role.title}>
                <span
                  className="tabular text-[13px] font-semibold text-faint"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <dt className="mt-3 text-[18px] font-semibold text-ink">{role.title}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-muted">{role.body}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-16 flex justify-center">
            <Link
              href="/demarche-pa"
              className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-line-strong bg-surface px-5 py-3 text-[15px] font-semibold text-navy transition-colors hover:border-navy"
            >
              Suivre notre démarche PA
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ————————————————— Sécurité ————————————————— */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="display-2 text-ink">Conçue pour des données qui comptent.</h2>
          </div>

          <dl className="mx-auto mt-16 grid max-w-5xl gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map((item) => (
              <div key={item.title}>
                <item.icon className="size-5 text-blue" aria-hidden="true" />
                <dt className="mt-4 text-[17px] font-semibold text-ink">{item.title}</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 flex justify-center">
            <ButtonLink href="/securite" variant="secondary" size="lg">
              Voir les mesures en place
              <ArrowRight />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ————————————————— Tarifs ————————————————— */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="display-2 text-ink">Un prix par mois, par entreprise.</h2>
            <p className="lead mt-6">
              Hors taxes. 14 jours d&apos;essai, sans carte bancaire.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
            {HOME_PLANS.map((slug) => {
              const plan = PLANS[slug];
              return (
                <div
                  key={plan.slug}
                  className={cn(
                    "relative flex h-full flex-col rounded-[18px] border bg-surface p-8 transition-shadow duration-200",
                    plan.highlighted
                      ? "border-navy shadow-lg lg:-my-4 lg:py-12"
                      : "border-line hover:shadow-sm",
                  )}
                >
                  {plan.highlighted ? (
                    <span className="absolute -top-3 left-8 rounded-full bg-navy px-3 py-1 text-[11px] font-semibold text-white">
                      Recommandé
                    </span>
                  ) : null}

                  <h3 className="text-[20px] font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-5 flex items-baseline gap-1.5">
                    <span className="tabular text-[2.75rem] font-semibold leading-none tracking-[-0.035em] text-ink">
                      {formatPlanPrice(plan)}
                    </span>
                    <span className="text-[14px] text-muted">HT / mois</span>
                  </p>

                  {/* Seules les lignes réellement disponibles apparaissent ici. */}
                  <PlanBullets
                    bullets={plan.bullets.filter((bullet) => !bullet.soon)}
                    className="mt-8 flex-1"
                  />

                  <ButtonLink
                    href="/inscription"
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="lg"
                    className="mt-8 w-full"
                  >
                    Commencer
                  </ButtonLink>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-1.5 py-1 text-[15px] font-semibold text-blue hover:underline"
            >
              Comparer toutes les offres et leur disponibilité
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ————————————————— FAQ ————————————————— */}
      <section id="faq" className="scroll-mt-28 border-b border-line bg-surface">
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-20">
          <h2 className="display-2 text-ink">Questions fréquentes</h2>
          <dl className="mt-12 divide-y divide-[color:var(--color-line)] border-t border-line">
            {FAQ_ON_HOME.map((item) => (
              <div key={item.q} className="py-7">
                <dt className="text-[18px] font-semibold text-ink">{item.q}</dt>
                <dd className="mt-3 text-[16px] leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/faq"
            className="mt-10 inline-flex items-center gap-1.5 py-1 text-[15px] font-semibold text-blue hover:underline"
          >
            Toutes les questions
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ————————————————— CTA final ————————————————— */}
      <section className="on-navy bg-navy">
        <div className="mx-auto max-w-[var(--container-prose)] px-5 py-24 text-center">
          <h2 className="display-2 text-white">
            Préparez votre entreprise à la facturation électronique.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[18px] leading-relaxed text-white/70">
            Créez votre compte et centralisez vos factures dès aujourd&apos;hui.
          </p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/inscription" variant="inverse" size="2xl">
              Créer mon compte
              <ArrowRight />
            </ButtonLink>
          </div>
          <p className="mt-6 text-[13.5px] text-white/45">
            14 jours gratuits • Sans carte bancaire
          </p>
        </div>
      </section>
    </>
  );
}
