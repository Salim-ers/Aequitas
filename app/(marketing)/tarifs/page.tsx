import type { Metadata } from "next";
import { Check } from "lucide-react";
import { PLAN_ORDER, PLANS, formatPlanPrice } from "@/src/config/plans";
import { PlanCta } from "@/components/marketing/plan-cta";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Quatre offres, un prix par mois et par entreprise. Essai de 14 jours, sans engagement.",
};

const FAQ = [
  {
    q: "Que se passe-t-il si je dépasse mon quota de factures ?",
    a: "Vous êtes prévenu à 80 % du quota, puis à 100 %. Vos données restent intactes et accessibles ; seule la création de nouvelles factures attend le passage à l'offre supérieure.",
  },
  {
    q: "Puis-je changer d'offre en cours de mois ?",
    a: "Oui, depuis la page Abonnement. Le prorata est calculé par Stripe et apparaît sur votre prochaine facture.",
  },
  {
    q: "Que devient mon compte si j'annule ?",
    a: "L'accès reste ouvert jusqu'à la fin de la période déjà payée. Vos factures et vos exports restent disponibles ; rien n'est supprimé automatiquement.",
  },
  {
    q: "Les prix sont-ils hors taxes ?",
    a: "Oui, tous les montants affichés sont hors taxes, par mois et par entreprise.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <p className="eyebrow">Tarifs</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-semibold text-[2.5rem] leading-tight tracking-[-0.015em] text-ink">
            Un prix par mois, par entreprise
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
            Tous les montants sont hors taxes. Essai de 14 jours sur chaque offre, sans
            engagement de durée.
          </p>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-5 lg:grid-cols-4">
            {PLAN_ORDER.map((slug) => {
              const plan = PLANS[slug];
              return (
                <div
                  key={plan.slug}
                  className={cn(
                    "flex flex-col rounded-[var(--radius-lg)] border bg-surface p-6",
                    plan.highlighted
                      ? "border-blue shadow-[0_16px_40px_-20px_rgba(14,76,70,0.45)]"
                      : "border-line",
                  )}
                >
                  {plan.highlighted ? (
                    <span className="mb-4 -mt-1 self-start rounded-full bg-blue-soft px-2.5 py-1 text-[11px] font-medium text-blue">
                      Le plus populaire
                    </span>
                  ) : null}

                  <h2 className="font-semibold text-[1.375rem] text-ink">{plan.name}</h2>
                  <p className="mt-1.5 min-h-[2.5rem] text-[13px] leading-relaxed text-muted">
                    {plan.tagline}
                  </p>

                  <p className="tabular mt-5 flex items-baseline gap-1.5">
                    <span className="text-[2rem] font-medium tracking-tight text-ink">
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
                        plan.monthlyPriceCents === null ? "Nous contacter" : "Choisir cette offre"
                      }
                    />
                  </div>

                  <ul className="mt-7 space-y-2.5 border-t border-line pt-6">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5 text-[13px] text-ink-soft">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-blue" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="font-semibold text-[1.75rem] tracking-[-0.01em] text-ink">
            Questions fréquentes
          </h2>
          <dl className="mt-8 divide-y divide-[color:var(--color-line)] border-t border-line">
            {FAQ.map((item) => (
              <div key={item.q} className="py-5">
                <dt className="text-[15px] font-medium text-ink">{item.q}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-muted">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
