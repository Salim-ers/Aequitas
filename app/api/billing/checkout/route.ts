import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getStripe } from "@/src/billing/stripe";
import { getDb } from "@/src/database/client";
import { organizations, stripeCustomers } from "@/src/database/schema";
import { requirePermission } from "@/src/auth/session";
import { getPlan, PLAN_ORDER, TRIAL_DAYS_DEFAULT } from "@/src/config/plans";
import { appUrl } from "@/src/lib/env";
import { recordAuditEvent } from "@/src/audit/audit-log";
import { logger } from "@/src/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  plan: z.enum(["essentiel", "pro", "business"]),
  period: z.enum(["monthly", "yearly"]).default("monthly"),
});

/** §14 / §17 — Ouverture d'une session Stripe Checkout. */
export async function POST(request: Request): Promise<NextResponse> {
  const context = await requirePermission("subscription:manage");

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Offre invalide", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const plan = getPlan(parsed.data.plan);
  const priceId =
    parsed.data.period === "yearly" ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;

  if (!priceId) {
    return NextResponse.json(
      {
        error: `Tarif Stripe non configuré pour l'offre ${plan.name}. Ajoutez la variable correspondante dans Vercel.`,
      },
      { status: 503 },
    );
  }

  const db = getDb();
  const stripe = getStripe();

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, context.organizationId))
    .limit(1);
  if (!org) {
    return NextResponse.json({ error: "Entreprise introuvable" }, { status: 404 });
  }

  // Un seul client Stripe par organisation.
  let [customerRow] = await db
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.organizationId, context.organizationId))
    .limit(1);

  if (!customerRow) {
    const customer = await stripe.customers.create(
      {
        name: org.legalName,
        email: org.email ?? context.user.email,
        metadata: { organizationId: context.organizationId },
        ...(org.vatNumber ? { tax_exempt: "none" as const } : {}),
      },
      { idempotencyKey: `customer:${context.organizationId}` },
    );
    [customerRow] = await db
      .insert(stripeCustomers)
      .values({
        organizationId: context.organizationId,
        stripeCustomerId: customer.id,
        email: org.email ?? context.user.email,
      })
      .returning();
  }

  if (!customerRow) {
    return NextResponse.json({ error: "Client Stripe indisponible" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerRow.stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    // §17 — l'organisation voyage dans les metadata : le webhook s'y raccroche.
    metadata: { organizationId: context.organizationId, plan: plan.slug },
    subscription_data: {
      metadata: { organizationId: context.organizationId, plan: plan.slug },
      ...(plan.trialDays > 0 ? { trial_period_days: plan.trialDays } : {}),
    },
    allow_promotion_codes: true,
    billing_address_collection: "required",
    automatic_tax: { enabled: false },
    locale: "fr",
    success_url: appUrl("/abonnement/succes?session_id={CHECKOUT_SESSION_ID}"),
    cancel_url: appUrl("/abonnement?statut=annule"),
  });

  await recordAuditEvent({
    organizationId: context.organizationId,
    actorUserId: context.user.id,
    action: "SUBSCRIPTION_CHANGED",
    entityType: "checkout_session",
    entityId: session.id,
    metadata: { plan: plan.slug, period: parsed.data.period },
  });

  logger.info("billing.checkout.created", {
    organizationId: context.organizationId,
    plan: plan.slug,
  });

  void PLAN_ORDER;
  void TRIAL_DAYS_DEFAULT;

  return NextResponse.json({ url: session.url });
}
