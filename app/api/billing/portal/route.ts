import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getStripe } from "@/src/billing/stripe";
import { getDb } from "@/src/database/client";
import { stripeCustomers } from "@/src/database/schema";
import { requirePermission } from "@/src/auth/session";
import { appUrl } from "@/src/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** §51 — « Gérer mon abonnement » ouvre le portail client Stripe. */
export async function POST(): Promise<NextResponse> {
  const context = await requirePermission("subscription:manage");

  const [customerRow] = await getDb()
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.organizationId, context.organizationId))
    .limit(1);

  if (!customerRow) {
    return NextResponse.json(
      { error: "Aucun abonnement à gérer pour le moment" },
      { status: 404 },
    );
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: customerRow.stripeCustomerId,
    return_url: appUrl("/abonnement"),
    locale: "fr",
  });

  return NextResponse.json({ url: session.url });
}
