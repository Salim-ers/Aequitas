import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { requireOrganization } from "@/src/auth/session";
import { checkLimit, getEntitlements } from "@/src/billing/entitlements";
import { formatPlanPrice } from "@/src/config/plans";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBar, CardContent } from "@/components/ui/card";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { PortalButton } from "@/components/app/portal-button";
import { formatDate } from "@/src/lib/utils";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = { title: "Abonnement", robots: { index: false } };
export const dynamic = "force-dynamic";

/** §9 — Les statuts techniques sont traduits en langage courant. */
const STATUS: Record<string, { label: string; tone: BadgeTone; detail: string }> = {
  INCOMPLETE: {
    label: "À activer",
    tone: "warning",
    detail: "Choisissez une offre pour ouvrir l'accès à votre espace.",
  },
  TRIALING: {
    label: "Essai en cours",
    tone: "blue",
    detail: "Vous profitez de votre période d'essai. Aucun paiement n'a encore été prélevé.",
  },
  ACTIVE: {
    label: "Actif",
    tone: "success",
    detail: "Votre abonnement est actif. Rien à faire de votre côté.",
  },
  PAST_DUE: {
    label: "Paiement en attente",
    tone: "warning",
    detail:
      "Un paiement n'a pas abouti. Votre accès reste ouvert : mettez à jour votre moyen de paiement.",
  },
  GRACE_PERIOD: {
    label: "Période de tolérance",
    tone: "warning",
    detail: "Votre accès reste ouvert le temps de régulariser le paiement.",
  },
  SUSPENDED: {
    label: "Suspendu",
    tone: "danger",
    detail: "L'accès est suspendu. Régularisez le paiement pour le rétablir.",
  },
  CANCELED: {
    label: "Résilié",
    tone: "neutral",
    detail: "Vos données restent conservées ; vous pouvez réactiver une offre à tout moment.",
  },
  INCOMPLETE_EXPIRED: {
    label: "Expiré",
    tone: "neutral",
    detail: "La souscription n'a pas abouti. Vous pouvez en démarrer une nouvelle.",
  },
};

export default async function SubscriptionPage() {
  const context = await requireOrganization();
  const [entitlements, invoices, users] = await Promise.all([
    getEntitlements(context.organizationId),
    checkLimit(context.organizationId, "invoices_per_month"),
    checkLimit(context.organizationId, "users"),
  ]);

  const status = STATUS[entitlements.status] ?? STATUS.INCOMPLETE!;
  const quotas = [
    { label: "Factures ce mois", check: invoices },
    { label: "Utilisateurs", check: users },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Abonnement"
        description="Votre offre, ce qu'elle inclut et où vous en êtes de vos quotas."
        action={entitlements.hasAccess ? <PortalButton /> : undefined}
      />

      {!entitlements.hasAccess ? (
        <Alert
          tone="warning"
          title={status.label}
          className="mt-6"
          action={
            <ButtonLink href="/onboarding/abonnement" size="sm">
              Choisir une offre
            </ButtonLink>
          }
        >
          {status.detail}
        </Alert>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardBar
            title={`Plan ${entitlements.plan.name}`}
            action={<Badge tone={status.tone} dot>{status.label}</Badge>}
          />
          <CardContent className="pt-5">
            <p className="flex items-baseline gap-1.5">
              <span className="tabular text-[2rem] font-semibold tracking-[-0.025em] text-ink">
                {formatPlanPrice(entitlements.plan)}
              </span>
              {entitlements.plan.monthlyPriceCents !== null ? (
                <span className="text-[13.5px] text-muted">HT / mois</span>
              ) : null}
            </p>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{status.detail}</p>

            <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[13.5px]">
              {entitlements.trialEndsAt ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Fin de l&apos;essai</dt>
                  <dd className="font-medium text-ink">
                    {formatDate(entitlements.trialEndsAt)}
                  </dd>
                </div>
              ) : null}
              {entitlements.currentPeriodEnd ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">
                    {entitlements.cancelAtPeriodEnd
                      ? "Accès jusqu'au"
                      : "Prochaine échéance"}
                  </dt>
                  <dd className="font-medium text-ink">
                    {formatDate(entitlements.currentPeriodEnd)}
                  </dd>
                </div>
              ) : null}
            </dl>

            <ul className="mt-5 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
              {entitlements.plan.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-[13px] text-ink-soft">
                  <Check
                    className="mt-0.5 size-3.5 shrink-0 text-blue"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardBar title="Vos quotas" />
          <CardContent className="space-y-5 pt-5">
            {quotas.map(({ label, check }) => {
              const percent = check.unlimited
                ? 0
                : Math.min(100, Math.round(check.ratio * 100));
              return (
                <div key={label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13.5px] text-muted">{label}</p>
                    <p className="tabular text-[13.5px] font-medium text-ink">
                      {check.unlimited
                        ? "Illimité"
                        : `${check.used} / ${check.limit}`}
                    </p>
                  </div>
                  {!check.unlimited ? (
                    <div
                      className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
                      role="progressbar"
                      aria-valuenow={percent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${label} : ${percent} % du quota utilisé`}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          check.exceeded
                            ? "bg-danger"
                            : check.nearingLimit
                              ? "bg-warning"
                              : "bg-blue",
                        )}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  ) : null}
                  {check.exceeded ? (
                    <p className="mt-1.5 text-[12.5px] text-danger">
                      Quota atteint. Passez à l&apos;offre supérieure pour continuer.
                    </p>
                  ) : check.nearingLimit ? (
                    <p className="mt-1.5 text-[12.5px] text-warning">
                      Vous approchez de la limite de votre offre.
                    </p>
                  ) : null}
                </div>
              );
            })}

            <p className="border-t border-line pt-4 text-[12.5px] leading-relaxed text-faint">
              Besoin de plus de volume ?{" "}
              <Link href="/tarifs" className="font-medium text-blue hover:underline">
                Comparer les offres
              </Link>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
