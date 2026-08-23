import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { requireOrganization } from "@/src/auth/session";
import { getEntitlements } from "@/src/billing/entitlements";
import { PLAN_ORDER, PLANS, formatPlanPrice, TRIAL_DAYS_DEFAULT } from "@/src/config/plans";
import { PlanCta } from "@/components/marketing/plan-cta";
import { PlanBullets } from "@/components/marketing/plan-bullets";
import { StepIndicator } from "@/components/ui/step-indicator";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = { title: "Choisir une offre", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * §21 — Étape 2 de l'onboarding : choix de l'offre.
 *
 * Cette route était référencée par la redirection de l'étape 1 sans exister :
 * l'inscription se terminait sur un 404. Elle s'appuie sur la session Stripe
 * Checkout déjà en place ; l'accès n'est ouvert que par le webhook (§113).
 */
export default async function OnboardingBillingPage() {
  const context = await requireOrganization();
  const entitlements = await getEntitlements(context.organizationId);

  // Abonnement déjà actif : l'étape n'a plus lieu d'être.
  if (entitlements.hasAccess) redirect("/dashboard");

  return (
    <div>
      <StepIndicator current={2} total={2} label="Votre offre" />

      <h1 className="mt-8 text-[1.875rem] font-semibold tracking-[-0.03em] text-ink">
        Choisissez votre offre.
      </h1>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
        {TRIAL_DAYS_DEFAULT} jours d&apos;essai sur chaque offre. Vous pouvez en changer
        à tout moment, et le prorata est calculé automatiquement.
      </p>

      <div className="mt-8 space-y-3">
        {PLAN_ORDER.map((slug) => {
          const plan = PLANS[slug];
          return (
            <div
              key={plan.slug}
              className={cn(
                "rounded-[var(--radius-lg)] border bg-surface p-5",
                plan.highlighted ? "border-blue shadow-sm" : "border-line",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[17px] font-semibold text-ink">{plan.name}</h2>
                  {plan.highlighted ? (
                    <span className="rounded-full bg-blue px-2 py-0.5 text-[11px] font-semibold text-white">
                      Recommandé
                    </span>
                  ) : null}
                </div>
                <p className="flex items-baseline gap-1.5">
                  <span className="tabular text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">
                    {formatPlanPrice(plan)}
                  </span>
                  {plan.monthlyPriceCents !== null ? (
                    <span className="text-[13px] text-muted">HT / mois</span>
                  ) : null}
                </p>
              </div>

              <p className="mt-1.5 text-[13.5px] text-muted">{plan.tagline}</p>

              <PlanBullets bullets={plan.bullets} limit={4} className="mt-4" />

              <div className="mt-5">
                <PlanCta
                  plan={plan.slug}
                  highlighted={plan.highlighted}
                  label={
                    plan.monthlyPriceCents === null
                      ? "Nous contacter"
                      : `Commencer avec ${plan.name}`
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 border-t border-line pt-6 text-[13px] leading-relaxed text-faint">
        Le paiement est traité par Stripe. Votre accès s&apos;ouvre dès la confirmation
        reçue. Une question sur les offres ?{" "}
        <Link href="/tarifs" className="font-medium text-blue hover:underline">
          Comparer en détail
        </Link>
        .
      </p>
    </div>
  );
}
