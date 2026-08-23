import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./_shared";
import { subscriptionStatusEnum } from "./enums";
import { organizations } from "./identity";

/**
 * §52 — Ces tables concernent EXCLUSIVEMENT l'abonnement SaaS payé à Aequitas.
 * Elles n'ont aucun lien avec les factures que le client émet dans Aequitas.
 */

export const stripeCustomers = pgTable(
  "stripe_customers",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    email: text("email"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("stripe_customers_org_key").on(t.organizationId),
    uniqueIndex("stripe_customers_stripe_key").on(t.stripeCustomerId),
  ],
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripePriceId: text("stripe_price_id"),
    plan: text("plan").notNull(),
    status: subscriptionStatusEnum("status").notNull().default("INCOMPLETE"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
    /** §115 — fin de la période de grâce avant suspension. */
    graceEndsAt: timestamp("grace_ends_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("subscriptions_org_key").on(t.organizationId),
    uniqueIndex("subscriptions_stripe_sub_key").on(t.stripeSubscriptionId),
    index("subscriptions_status_idx").on(t.status),
  ],
);

export const billingEvents = pgTable(
  "billing_events",
  {
    id: idColumn(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    type: text("type").notNull(),
    stripeEventId: text("stripe_event_id"),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps,
  },
  (t) => [
    index("billing_events_org_idx").on(t.organizationId),
    index("billing_events_type_idx").on(t.type),
  ],
);

/**
 * §90 — Idempotence des webhooks Stripe.
 * L'unicité sur stripe_event_id est la garantie ; l'insertion se fait
 * AVANT le traitement, dans la même transaction.
 */
export const processedWebhooks = pgTable(
  "processed_webhooks",
  {
    id: idColumn(),
    source: text("source").notNull().default("stripe"),
    eventId: text("event_id").notNull(),
    eventType: text("event_type").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex("processed_webhooks_source_event_key").on(t.source, t.eventId)],
);

/** §19 — Compteurs d'usage par période de facturation. */
export const usageMetrics = pgTable(
  "usage_metrics",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    metric: text("metric").notNull(),
    /** Période au format YYYY-MM, ou "lifetime" pour les compteurs non périodiques. */
    period: text("period").notNull(),
    value: integer("value").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("usage_metrics_org_metric_period_key").on(
      t.organizationId,
      t.metric,
      t.period,
    ),
    index("usage_metrics_org_idx").on(t.organizationId),
  ],
);
