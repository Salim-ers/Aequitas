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
import {
  electronicFormatEnum,
  notificationKindEnum,
  supportTicketStatusEnum,
  transmissionStatusEnum,
  webhookDeliveryStatusEnum,
} from "./enums";
import { organizations, users } from "./identity";
import { invoices } from "./commerce";

/** §31 / §75 — Représentation électronique d'une facture, séparée de la facture métier. */
export const electronicInvoices = pgTable(
  "electronic_invoices",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    format: electronicFormatEnum("format").notNull(),
    profile: text("profile"),
    /** Le XML complet n'est jamais journalisé (§67) ; il est stocké en Blob. */
    documentBlobPathname: text("document_blob_pathname"),
    checksumSha256: text("checksum_sha256"),
    validationReport: jsonb("validation_report").$type<Record<string, unknown> | null>(),
    generatedAt: timestamp("generated_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("electronic_invoices_org_idx").on(t.organizationId),
    uniqueIndex("electronic_invoices_invoice_format_key").on(t.invoiceId, t.format),
  ],
);

export const transmissions = pgTable(
  "transmissions",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    electronicInvoiceId: uuid("electronic_invoice_id").references(
      () => electronicInvoices.id,
      { onDelete: "set null" },
    ),
    invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "set null" }),
    channel: text("channel").notNull(),
    status: transmissionStatusEnum("status").notNull().default("QUEUED"),
    /** §76 — vrai tant qu'aucun canal officiel n'est raccordé. */
    simulated: boolean("simulated").notNull().default(true),
    idempotencyKey: text("idempotency_key").notNull(),
    remoteReference: text("remote_reference"),
    lastError: text("last_error"),
    attempts: integer("attempts").notNull().default(0),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("transmissions_idempotency_key").on(t.organizationId, t.idempotencyKey),
    index("transmissions_org_status_idx").on(t.organizationId, t.status),
  ],
);

export const lifecycleEvents = pgTable(
  "lifecycle_events",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    label: text("label").notNull(),
    simulated: boolean("simulated").notNull().default(true),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps,
  },
  (t) => [index("lifecycle_events_invoice_idx").on(t.invoiceId)],
);

export const reportingRecords = pgTable(
  "reporting_records",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    period: text("period").notNull(),
    status: transmissionStatusEnum("status").notNull().default("QUEUED"),
    simulated: boolean("simulated").notNull().default(true),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps,
  },
  (t) => [uniqueIndex("reporting_records_org_kind_period_key").on(t.organizationId, t.kind, t.period)],
);

/** §42 — Seul le hash de la clé est stocké. */
export const apiKeys = pgTable(
  "api_keys",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    prefix: text("prefix").notNull(),
    keyHash: text("key_hash").notNull(),
    scopes: jsonb("scopes").$type<string[]>().notNull().default([]),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("api_keys_hash_key").on(t.keyHash),
    index("api_keys_org_idx").on(t.organizationId),
    index("api_keys_prefix_idx").on(t.prefix),
  ],
);

export const webhookEndpoints = pgTable(
  "webhook_endpoints",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    description: text("description"),
    events: jsonb("events").$type<string[]>().notNull().default([]),
    secretHash: text("secret_hash").notNull(),
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (t) => [index("webhook_endpoints_org_idx").on(t.organizationId)],
);

export const webhookDeliveries = pgTable(
  "webhook_deliveries",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    endpointId: uuid("endpoint_id")
      .notNull()
      .references(() => webhookEndpoints.id, { onDelete: "cascade" }),
    eventType: text("event_type").notNull(),
    eventId: uuid("event_id").notNull(),
    status: webhookDeliveryStatusEnum("status").notNull().default("PENDING"),
    attempts: integer("attempts").notNull().default(0),
    responseStatus: integer("response_status"),
    lastError: text("last_error"),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("webhook_deliveries_endpoint_event_key").on(t.endpointId, t.eventId),
    index("webhook_deliveries_status_idx").on(t.status, t.nextAttemptAt),
  ],
);

/** §45 — Journal append-only : aucune route d'écriture ne fait UPDATE ni DELETE. */
export const auditEvents = pgTable(
  "audit_events",
  {
    id: idColumn(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    actorType: text("actor_type").notNull().default("USER"),
    action: text("action").notNull(),
    entityType: text("entity_type"),
    entityId: text("entity_id"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [
    index("audit_events_org_time_idx").on(t.organizationId, t.occurredAt),
    index("audit_events_action_idx").on(t.action),
  ],
);

export const securityEvents = pgTable(
  "security_events",
  {
    id: idColumn(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    kind: text("kind").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index("security_events_user_idx").on(t.userId, t.occurredAt)],
);

export const notifications = pgTable(
  "notifications",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    kind: notificationKindEnum("kind").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    href: text("href"),
    readAt: timestamp("read_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("notifications_org_user_idx").on(t.organizationId, t.userId, t.readAt)],
);

export const supportTickets = pgTable(
  "support_tickets",
  {
    id: idColumn(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: supportTicketStatusEnum("status").notNull().default("OPEN"),
    contactEmail: text("contact_email").notNull(),
    ...timestamps,
  },
  (t) => [index("support_tickets_status_idx").on(t.status)],
);

/** §72 — Formulaire de contact public. */
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: idColumn(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    company: text("company"),
    message: text("message").notNull(),
    ipHash: text("ip_hash"),
    handledAt: timestamp("handled_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [index("contact_messages_created_idx").on(t.createdAt)],
);

/** §37 — Modèles de factures récurrentes. */
export const recurringInvoices = pgTable(
  "recurring_invoices",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").notNull(),
    name: text("name").notNull(),
    frequency: text("frequency").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    nextRunAt: timestamp("next_run_at", { withTimezone: true }),
    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
    active: boolean("active").notNull().default(true),
    template: jsonb("template").$type<Record<string, unknown>>().notNull().default({}),
    ...timestamps,
  },
  (t) => [index("recurring_invoices_next_run_idx").on(t.active, t.nextRunAt)],
);

/** §89 — Clés d'idempotence génériques pour les jobs et l'API. */
export const idempotencyKeys = pgTable(
  "idempotency_keys",
  {
    id: idColumn(),
    scope: text("scope").notNull(),
    key: text("key").notNull(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    result: jsonb("result").$type<Record<string, unknown> | null>(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex("idempotency_keys_scope_key").on(t.scope, t.key)],
);
