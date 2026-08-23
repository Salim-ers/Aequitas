import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireOrganization } from "@/src/auth/session";
import { getEntitlements } from "@/src/billing/entitlements";
import { SubscriptionActivation } from "@/components/app/subscription-activation";

export const metadata: Metadata = { title: "Activation", robots: { index: false } };
export const dynamic = "force-dynamic";

/**
 * §113 — Arriver sur cette URL ne débloque rien.
 * L'accès s'ouvre quand le webhook Stripe a écrit un statut actif en base.
 */
export default async function BillingSuccessPage() {
  const context = await requireOrganization();
  const entitlements = await getEntitlements(context.organizationId);

  if (entitlements.hasAccess) redirect("/dashboard");

  return <SubscriptionActivation planName={entitlements.plan.name} />;
}
