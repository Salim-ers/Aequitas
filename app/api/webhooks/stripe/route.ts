import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { getStripe } from "@/src/billing/stripe";
import { stripeEnv } from "@/src/lib/env";
import { getDb } from "@/src/database/client";
import { processedWebhooks } from "@/src/database/schema";
import {
  markSubscriptionCanceled,
  recordBillingEvent,
  resolveOrganizationId,
  upsertSubscriptionFromStripe,
} from "@/src/billing/subscription-service";
import { logger } from "@/src/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * §15 / §90 — Webhook Stripe.
 * 1. La signature est vérifiée sur le corps brut.
 * 2. L'événement est enregistré AVANT traitement : le conflit d'unicité
 *    sur (source, event_id) rend un rejeu strictement sans effet.
 */

const HANDLED_EVENTS = new Set<Stripe.Event["type"]>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

export async function POST(request: Request): Promise<NextResponse> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      stripeEnv().STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    logger.warn("stripe.webhook.invalid_signature", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const db = getDb();

  // Verrou d'idempotence : si la ligne existe déjà, on sort en 200 sans rejouer.
  const inserted = await db
    .insert(processedWebhooks)
    .values({ source: "stripe", eventId: event.id, eventType: event.type })
    .onConflictDoNothing({
      target: [processedWebhooks.source, processedWebhooks.eventId],
    })
    .returning({ id: processedWebhooks.id });

  if (inserted.length === 0) {
    logger.info("stripe.webhook.duplicate", { eventId: event.id, type: event.type });
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, handled: false });
  }

  try {
    await handleEvent(event);
    await db
      .update(processedWebhooks)
      .set({ processedAt: new Date() })
      .where(eq(processedWebhooks.id, inserted[0]!.id));
    return NextResponse.json({ received: true });
  } catch (error) {
    // On supprime le verrou pour permettre le rejeu automatique de Stripe.
    await db
      .delete(processedWebhooks)
      .where(eq(processedWebhooks.id, inserted[0]!.id));
    logger.error("stripe.webhook.handler_failed", {
      eventId: event.id,
      type: event.type,
      message: error instanceof Error ? error.message : "unknown",
    });
    return NextResponse.json({ error: "Traitement impossible" }, { status: 500 });
  }
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const organizationId = await resolveOrganizationId(
        session.metadata,
        typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null),
      );
      await recordBillingEvent(organizationId, event.type, event.id, {
        sessionId: session.id,
        mode: session.mode,
      });
      // L'abonnement lui-même arrive via customer.subscription.created.
      if (session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        await upsertSubscriptionFromStripe(subscription);
      }
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      await upsertSubscriptionFromStripe(subscription);
      await recordBillingEvent(
        await resolveOrganizationId(
          subscription.metadata,
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id,
        ),
        event.type,
        event.id,
        { subscriptionId: subscription.id, status: subscription.status },
      );
      return;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await markSubscriptionCanceled(subscription);
      await recordBillingEvent(null, event.type, event.id, {
        subscriptionId: subscription.id,
      });
      return;
    }

    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : (invoice.customer?.id ?? null);
      const organizationId = await resolveOrganizationId(invoice.metadata, customerId);
      await recordBillingEvent(organizationId, event.type, event.id, {
        invoiceId: invoice.id,
        amountDue: invoice.amount_due,
        currency: invoice.currency,
      });
      return;
    }

    default:
      return;
  }
}
