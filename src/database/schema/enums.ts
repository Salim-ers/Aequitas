import { pgEnum } from "drizzle-orm/pg-core";

/** §98 — Rôle plateforme (Aequitas) distinct du rôle organisation. */
export const platformRoleEnum = pgEnum("platform_role", ["USER", "SUPPORT", "ADMIN", "SUPER_ADMIN"]);

/** §40 */
export const organizationRoleEnum = pgEnum("organization_role", [
  "OWNER",
  "ADMIN",
  "ACCOUNTANT",
  "BILLING",
  "SALES",
  "READ_ONLY",
]);

export const membershipStatusEnum = pgEnum("membership_status", ["ACTIVE", "SUSPENDED"]);
export const invitationStatusEnum = pgEnum("invitation_status", [
  "PENDING",
  "ACCEPTED",
  "REVOKED",
  "EXPIRED",
]);

/** §115 — États d'abonnement, alignés Stripe + période de grâce interne. */
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "INCOMPLETE",
  "TRIALING",
  "ACTIVE",
  "PAST_DUE",
  "GRACE_PERIOD",
  "SUSPENDED",
  "CANCELED",
  "INCOMPLETE_EXPIRED",
]);

export const partyTypeEnum = pgEnum("party_type", ["COMPANY", "INDIVIDUAL", "PUBLIC_ENTITY"]);
export const productTypeEnum = pgEnum("product_type", ["GOOD", "SERVICE"]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REFUSED",
  "EXPIRED",
  "CONVERTED",
]);

/** §36 — Statuts strictement séparés. */
export const invoiceBusinessStatusEnum = pgEnum("invoice_business_status", [
  "DRAFT",
  "ISSUED",
  "SENT",
  "CANCELLED",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "WRITTEN_OFF",
]);

export const electronicInvoiceStatusEnum = pgEnum("electronic_invoice_status", [
  "NOT_APPLICABLE",
  "PENDING_GENERATION",
  "GENERATED",
  "VALIDATION_FAILED",
  "READY_TO_TRANSMIT",
]);

export const transmissionStatusEnum = pgEnum("transmission_status", [
  "QUEUED",
  "SIMULATED",
  "SENT",
  "ACKNOWLEDGED",
  "REJECTED",
  "FAILED",
]);

export const documentKindEnum = pgEnum("document_kind", ["QUOTE", "INVOICE", "CREDIT_NOTE"]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "BANK_TRANSFER",
  "CARD",
  "CASH",
  "DIRECT_DEBIT",
  "CHECK",
  "OTHER",
]);

export const incomingInvoiceStatusEnum = pgEnum("incoming_invoice_status", [
  "RECEIVED",
  "TO_REVIEW",
  "APPROVED",
  "DISPUTED",
  "PAID",
  "ARCHIVED",
]);

export const electronicFormatEnum = pgEnum("electronic_format", [
  "FACTUR_X",
  "UBL",
  "CII",
  "PDF_ONLY",
  "UNKNOWN",
]);

export const notificationKindEnum = pgEnum("notification_kind", [
  "INVOICE",
  "PAYMENT",
  "OVERDUE",
  "SECURITY",
  "SUBSCRIPTION",
  "TEAM",
  "SYSTEM",
]);

export const supportTicketStatusEnum = pgEnum("support_ticket_status", [
  "OPEN",
  "PENDING",
  "RESOLVED",
  "CLOSED",
]);

export const webhookDeliveryStatusEnum = pgEnum("webhook_delivery_status", [
  "PENDING",
  "DELIVERED",
  "FAILED",
  "ABANDONED",
]);
