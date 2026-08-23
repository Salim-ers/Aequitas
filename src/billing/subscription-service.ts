import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { getDb } from "@/src/database/client";
import { billingEvents, subscriptions, stripeCustomers } from "@/src/database/schema";
import { planFromStripePriceId } from "@/src/config/plans";
import type { SubscriptionStatus } from "./entitlements";

/**
 * §17 / §90 — Le webhook Stripe est la seule source de vérité de l'abonnement.
 * La redirection de retour Checkout ne débloque jamais l'application.
 */

const GRACE_PERIOD_DAYS = Number(process.env.BILLING_GRACE_PERIOD_DAYS ?? 7);

export function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "TRIALING";
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "unpaid":
      return "GRACE_PERIOD";
    case "canceled":
      return "CANCELED";
    case "incomplete":
      return "INCOMPLETE";
    case "incomplete_expired":
      return "INCOMPLETE_EXPIRED";
    case "paused":
      return "SUSPENDED";
    default:
      return "INCOMPLETE";
  }
}

function toDate(seconds: number | null | undefined): Date | null {
  return typeof seconds === "number" ? new Date(seconds * 1000) : null;
}

/** Retrouve l'organisation : metadata d'abord, table de correspondance ensuite. */
export async function resolveOrganizationId(
  metadata: Stripe.Metadata | null | undefined,
  stripeCustomerId: string | null,
): Promise<string | null> {
  const fromMetadata = metadata?.organizationId;
  if (fromMetadata) return fromMetadata;
  if (!stripeCustomerId) return null;

  const [row] = await getDb()
    .select({ organizationId: stripeCustomers.organizationId })
    .from(stripeCustomers)
    .where(eq(stripeCustomers.stripeCustomerId, stripeCustomerId))
    .limit(1);
  return row?.organizationId ?? null;
}

export async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription,
): Promise<void> {
  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const organizationId = await resolveOrganizationId(
    subscription.metadata,
    stripeCustomerId,
  );
  if (!organizationId) {
    throw new Error(
      `Abonnement Stripe ${subscription.id} sans organisation identifiable`,
    );
  }

  const item = subscription.items.data[0];
  const priceId = item?.price.id ?? null;
  const plan = priceId ? planFromStripePriceId(priceId) : null;
  const status = mapStripeStatus(subscription.status);

  // Les timestamps de période vivent sur l'item d'abonnement dans les API récentes.
  const rawItem = item as unknown as Record<string, unknown> | undefined;
  const rawSub = subscription as unknown as Record<string, unknown>;
  const periodStart =
    (rawItem?.current_period_start as number | undefined) ??
    (rawSub.current_period_start as number | undefined) ??
    null;
  const periodEnd =
    (rawItem?.current_period_end as number | undefined) ??
    (rawSub.current_period_end as number | undefined) ??
    null;

  const graceEndsAt =
    status === "PAST_DUE" || status === "GRACE_PERIOD"
      ? new Date(Date.now() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000)
      : null;

  const values = {
    organizationId,
    stripeCustomerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    plan: plan?.slug ?? "essentiel",
    status,
    currentPeriodStart: toDate(periodStart),
    currentPeriodEnd: toDate(periodEnd),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    canceledAt: toDate(subscription.canceled_at),
    trialEndsAt: toDate(subscription.trial_end),
    graceEndsAt,
    updatedAt: new Date(),
  };

  await getDb()
    .insert(subscriptions)
    .values(values)
    .onConflictDoUpdate({
      target: subscriptions.organizationId,
      set: values,
    });
}

export async function recordBillingEvent(
  organizationId: string | null,
  type: string,
  stripeEventId: string | null,
  payload: Record<string, unknown>,
): Promise<void> {
  await getDb().insert(billingEvents).values({
    organizationId,
    type,
    stripeEventId,
    payload,
  });
}

export async function markSubscriptionCanceled(
  subscription: Stripe.Subscription,
): Promise<void> {
  const stripeCustomerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;
  const organizationId = await resolveOrganizationId(
    subscription.metadata,
    stripeCustomerId,
  );
  if (!organizationId) return;

  // §115 — on ne supprime jamais les données : l'accès se ferme, le compte reste.
  await getDb()
    .update(subscriptions)
    .set({
      status: "CANCELED",
      canceledAt: new Date(),
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.organizationId, organizationId));
}
