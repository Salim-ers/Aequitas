import { Fragment } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Check, Minus, Clock } from "lucide-react";
import { PLAN_ORDER, PLANS, formatPlanPrice, type FeatureKey } from "@/src/config/plans";
import { PlanCta } from "@/components/marketing/plan-cta";
import { PlanBullets } from "@/components/marketing/plan-bullets";
import { SectionHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table";
import { FEATURE_AVAILABILITY } from "@/src/content/status";
import { Alert } from "@/components/ui/alert";
import { FaqJsonLd } from "@/components/marketing/structured-data";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Quatre offres à partir de 19 € HT par mois et par entreprise, utilisateurs inclus. Essai de 14 jours, sans carte bancaire.",
};

/** §19 — Le tableau détaillé vit sous les cartes, pas dedans. */
const FEATURE_LABELS: { key: FeatureKey; label: string; group: string }[] = [
  { group: "Facturer", key: "quotes", label: "Devis" },
  { group: "Facturer", key: "invoices", label: "Factures" },
  { group: "Facturer", key: "credit_notes", label: "Avoirs" },
  { group: "Facturer", key: "recurring_invoices", label: "Factures récurrentes" },
  { group: "Encaisser", key: "automated_reminders", label: "Relances automatiques" },
  { group: "Centraliser", key: "suppliers", label: "Fournisseurs" },
  { group: "Centraliser", key: "supplier_import", label: "Import de factures fournisseurs" },
  { group: "Centraliser", key: "exports", label: "Exports CSV et PDF" },
  { group: "Centraliser", key: "accounting_export", label: "Export comptable" },
  { group: "Centraliser", key: "bank_reconciliation", label: "Rapprochement bancaire" },
  { group: "Centraliser", key: "supplier_ocr", label: "Lecture automatique des factures reçues" },
  { group: "Collaborer", key: "client_portal", label: "Portail client" },
  { group: "Collaborer", key: "accountant_access", label: "Accès expert-comptable" },
  { group: "Facturation électronique", key: "factur_x", label: "Format Factur-X" },
  { group: "Facturation électronique", key: "e_reporting", label: "E-reporting" },
  { group: "Développeurs", key: "api_access", label: "Accès API" },
  { group: "Développeurs", key: "webhooks", label: "Webhooks" },
  { group: "Organisation", key: "audit_log", label: "Journal d'audit" },
  { group: "Organisation", key: "advanced_permissions", label: "Permissions avancées" },
  { group: "Organisation", key: "sso", label: "Authentification unique (SSO)" },
  { group: "Organisation", key: "priority_support", label: "Support prioritaire" },
];

const FAQ = [
  {
    q: "Que se passe-t-il si je dépasse mon quota de factures ?",
    a: "Vous êtes prévenu à 80 % du quota, puis à 100 %. Vos données restent intactes et accessibles ; seule la création de nouvelles factures attend le passage à l'offre supérieure.",
  },
  {
    q: "Puis-je changer d'offre en cours de mois ?",
    a: "Oui, depuis votre page Abonnement. Le prorata est calculé automatiquement et apparaît sur votre prochaine facture.",
  },
  {
    q: "Que devient mon compte si j'annule ?",
    a: "L'accès reste ouvert jusqu'à la fin de la période déjà payée. Vos factures et vos exports restent disponibles ; rien n'est supprimé automatiquement.",
  },
  {
    q: "Les prix sont-ils hors taxes ?",
    a: "Oui, tous les montants affichés sont hors taxes, par mois et par entreprise.",
  },
  {
    q: "Faut-il une carte bancaire pour l'essai ?",
    a: "Non. Vous créez votre compte, vous testez pendant 14 jours, et vous choisissez une offre seulement si Aequitas vous convient.",
  },
];

function limitLabel(value: number): string {
  if (value === -1) return "Illimité";
  return new Intl.NumberFormat("fr-FR").format(value);
}

export default function PricingPage() {
  const groups = [...new Set(FEATURE_LABELS.map((f) => f.group))];

  return (
    <>
      <FaqJsonLd items={FAQ} />

      <section>
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-10 text-center">
          <SectionHeader
            align="center"
            eyebrow="Tarifs"
            title="À partir de 19 € par mois, par entreprise."
            as="h1"
            description="Hors taxes, utilisateurs inclus dans chaque offre. Essai de 14 jours, sans carte bancaire et sans engagement de durée."
          />
        </div>
      </section>

      {/* ————————————————— Les offres ————————————————— */}
      <section>
        <div className="mx-auto max-w-6xl px-5 pb-20">
          <Alert tone="info" title="Ouverture progressive" className="mb-10">
            Aequitas ouvre ses modules par vagues. Les lignes marquées
            « Bientôt » sont comprises dans l&apos;offre mais pas encore
            activées : elles ne vous sont pas facturées comme disponibles.{" "}
            <Link href="/demarche-pa" className="font-medium text-blue underline">
              Voir l&apos;état d&apos;avancement
            </Link>
            .
          </Alert>

          <div className="grid items-start gap-5 lg:grid-cols-4">
            {PLAN_ORDER.map((slug) => {
              const plan = PLANS[slug];
              return (
                <div
                  key={plan.slug}
                  className={cn(
                    "card-3d relative flex h-full flex-col rounded-[24px] p-7",
                    plan.highlighted && "ring-2 ring-navy lg:-my-3 lg:py-10",
                  )}
                >
                  {plan.highlighted ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-blue px-2.5 py-1 text-[11px] font-semibold text-white">
                      Recommandé
                    </span>
                  ) : null}

                  <h2 className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
                    {plan.name}
                  </h2>
                  <p className="mt-1.5 min-h-[2.75rem] text-[13px] leading-relaxed text-muted">
                    {plan.tagline}
                  </p>

                  <p className="mt-5 flex items-baseline gap-1.5">
                    <span className="tabular text-[2.25rem] font-semibold leading-none tracking-[-0.03em] text-ink">
                      {formatPlanPrice(plan)}
                    </span>
                    {plan.monthlyPriceCents !== null ? (
                      <span className="text-[13px] text-muted">HT / mois</span>
                    ) : null}
                  </p>

                  <div className="mt-6">
                    <PlanCta
                      plan={plan.slug}
                      highlighted={plan.highlighted}
                      label={
                        plan.monthlyPriceCents === null
                          ? "Nous contacter"
                          : "Commencer"
                      }
                    />
                  </div>

                  <PlanBullets
                    bullets={plan.bullets}
                    className="mt-7 border-t border-line pt-6"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ——————————— Comparatif détaillé ——————————— */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="display-3 text-ink">Comparer toutes les fonctionnalités</h2>

          {/* La distinction inclus / disponible est le cœur de ce tableau. */}
          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-[13.5px] text-muted">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-success" strokeWidth={2.5} aria-hidden="true" />
              Inclus et disponible aujourd&apos;hui
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-faint" aria-hidden="true" />
              Inclus dans l&apos;offre, activation à venir
            </li>
            <li className="flex items-center gap-2">
              <Minus className="size-4 text-line-strong" aria-hidden="true" />
              Non inclus
            </li>
          </ul>

          <TableScroll className="mt-8 rounded-[var(--radius-lg)] border border-line">
            <table className="w-full min-w-[46rem] text-[13.5px]">
              <caption className="sr-only">
                Comparaison des fonctionnalités incluses dans chaque offre Aequitas
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-10 border-b border-line bg-surface px-4 py-3 text-left text-[12px] font-medium uppercase tracking-[0.04em] text-faint"
                  >
                    Fonctionnalité
                  </th>
                  {PLAN_ORDER.map((slug) => (
                    <th
                      key={slug}
                      scope="col"
                      className={cn(
                        "border-b border-line px-4 py-3 text-center text-[13px] font-semibold",
                        PLANS[slug].highlighted ? "bg-blue-soft text-blue" : "text-ink",
                      )}
                    >
                      {PLANS[slug].name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Limites d'abord : c'est ce qui décide dans 90 % des cas. */}
                <tr>
                  <th
                    scope="rowgroup"
                    colSpan={5}
                    className="border-b border-line bg-surface-2/60 px-4 py-2 text-left text-[12px] font-semibold text-ink"
                  >
                    Volumes
                  </th>
                </tr>
                {(
                  [
                    ["invoices_per_month", "Factures par mois"],
                    ["users", "Utilisateurs"],
                    ["organizations", "Entreprises"],
                  ] as const
                ).map(([key, label]) => (
                  <tr key={key}>
                    <th
                      scope="row"
                      className="sticky left-0 border-b border-line bg-surface px-4 py-3 text-left font-normal text-ink-soft"
                    >
                      {label}
                    </th>
                    {PLAN_ORDER.map((slug) => (
                      <td
                        key={slug}
                        className={cn(
                          "tabular border-b border-line px-4 py-3 text-center text-ink",
                          PLANS[slug].highlighted && "bg-blue-soft/40",
                        )}
                      >
                        {limitLabel(PLANS[slug].limits[key])}
                      </td>
                    ))}
                  </tr>
                ))}

                {groups.map((group) => (
                  <Fragment key={group}>
                    <tr>
                      <th
                        scope="rowgroup"
                        colSpan={5}
                        className="border-b border-line bg-surface-2/60 px-4 py-2 text-left text-[12px] font-semibold text-ink"
                      >
                        {group}
                      </th>
                    </tr>
                    {FEATURE_LABELS.filter((f) => f.group === group).map((feature) => (
                      <tr key={feature.key}>
                        <th
                          scope="row"
                          className="sticky left-0 border-b border-line bg-surface px-4 py-3 text-left font-normal text-ink-soft"
                        >
                          {feature.label}
                        </th>
                        {PLAN_ORDER.map((slug) => {
                          const included = PLANS[slug].features.includes(feature.key);
                          return (
                            <td
                              key={slug}
                              className={cn(
                                "border-b border-line px-4 py-3 text-center",
                                PLANS[slug].highlighted && "bg-blue-soft/40",
                              )}
                            >
                              {!included ? (
                                <>
                                  <Minus
                                    className="mx-auto size-4 text-line-strong"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">Non inclus</span>
                                </>
                              ) : FEATURE_AVAILABILITY[feature.key] === "available" ? (
                                <>
                                  <Check
                                    className="mx-auto size-4 text-success"
                                    strokeWidth={2.5}
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">Inclus et disponible</span>
                                </>
                              ) : (
                                <>
                                  <Clock
                                    className="mx-auto size-4 text-faint"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">
                                    Inclus dans l&apos;offre, pas encore disponible
                                  </span>
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </TableScroll>
        </div>
      </section>

      {/* ————————————————— Questions ————————————————— */}
      <section>
        <div className="mx-auto max-w-3xl px-5 py-20">
          <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
            Questions fréquentes
          </h2>
          <dl className="mt-8 divide-y divide-[color:var(--color-line)] border-t border-line">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="text-[15px] font-semibold text-ink">{item.q}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
