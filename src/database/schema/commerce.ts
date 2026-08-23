import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { idColumn, money, quantity, rate, timestamps } from "./_shared";
import {
  documentKindEnum,
  electronicFormatEnum,
  electronicInvoiceStatusEnum,
  incomingInvoiceStatusEnum,
  invoiceBusinessStatusEnum,
  partyTypeEnum,
  paymentMethodEnum,
  paymentStatusEnum,
  productTypeEnum,
  quoteStatusEnum,
} from "./enums";
import { organizations, users } from "./identity";

/**
 * §41 — Toute table métier porte organization_id et un index dessus.
 * Aucune requête ne doit être écrite sans ce filtre : voir src/database/tenant.ts.
 */

export const customers = pgTable(
  "customers",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    type: partyTypeEnum("type").notNull().default("COMPANY"),
    companyName: text("company_name"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    siren: text("siren"),
    siret: text("siret"),
    vatNumber: text("vat_number"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    postalCode: text("postal_code"),
    city: text("city"),
    country: text("country").notNull().default("FR"),
    paymentTermsDays: integer("payment_terms_days").notNull().default(30),
    defaultTaxRateId: text("default_tax_rate_id"),
    notes: text("notes"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("customers_org_idx").on(t.organizationId),
    index("customers_org_name_idx").on(t.organizationId, t.companyName),
    index("customers_org_email_idx").on(t.organizationId, t.email),
  ],
);

export const suppliers = pgTable(
  "suppliers",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    type: partyTypeEnum("type").notNull().default("COMPANY"),
    companyName: text("company_name"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email"),
    phone: text("phone"),
    siren: text("siren"),
    siret: text("siret"),
    vatNumber: text("vat_number"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    postalCode: text("postal_code"),
    city: text("city"),
    country: text("country").notNull().default("FR"),
    paymentTermsDays: integer("payment_terms_days").notNull().default(30),
    iban: text("iban"),
    notes: text("notes"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    index("suppliers_org_idx").on(t.organizationId),
    index("suppliers_org_name_idx").on(t.organizationId, t.companyName),
  ],
);

export const products = pgTable(
  "products",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    type: productTypeEnum("type").notNull().default("SERVICE"),
    unit: text("unit").notNull().default("unité"),
    unitPriceHT: money("unit_price_ht").notNull().default("0"),
    taxRateId: text("tax_rate_id").notNull().default("fr-standard-20"),
    sku: text("sku"),
    active: boolean("active").notNull().default(true),
    ...timestamps,
  },
  (t) => [
    index("products_org_idx").on(t.organizationId),
    uniqueIndex("products_org_sku_key").on(t.organizationId, t.sku),
  ],
);

/** §28 — Séquence transactionnelle : une ligne par (org, type, année). */
export const invoiceSequences = pgTable(
  "invoice_sequences",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    kind: documentKindEnum("kind").notNull(),
    year: integer("year").notNull(),
    prefix: text("prefix").notNull(),
    padding: integer("padding").notNull().default(6),
    nextValue: integer("next_value").notNull().default(1),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("invoice_sequences_org_kind_year_key").on(t.organizationId, t.kind, t.year),
  ],
);

export const quotes = pgTable(
  "quotes",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    number: text("number").notNull(),
    status: quoteStatusEnum("status").notNull().default("DRAFT"),
    issueDate: date("issue_date").notNull(),
    validUntil: date("valid_until"),
    currency: text("currency").notNull().default("EUR"),
    globalDiscountPercent: rate("global_discount_percent").notNull().default("0"),
    totalHT: money("total_ht").notNull().default("0"),
    totalTax: money("total_tax").notNull().default("0"),
    totalTTC: money("total_ttc").notNull().default("0"),
    vatBreakdown: jsonb("vat_breakdown").$type<unknown[]>().notNull().default([]),
    notes: text("notes"),
    termsText: text("terms_text"),
    convertedInvoiceId: uuid("converted_invoice_id"),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("quotes_org_number_key").on(t.organizationId, t.number),
    index("quotes_org_status_idx").on(t.organizationId, t.status),
    index("quotes_org_customer_idx").on(t.organizationId, t.customerId),
  ],
);

export const quoteLines = pgTable(
  "quote_lines",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    quoteId: uuid("quote_id")
      .notNull()
      .references(() => quotes.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    unit: text("unit").notNull().default("unité"),
    quantity: quantity("quantity").notNull().default("1"),
    unitPriceHT: money("unit_price_ht").notNull().default("0"),
    discountPercent: rate("discount_percent").notNull().default("0"),
    taxRateId: text("tax_rate_id").notNull(),
    netHT: money("net_ht").notNull().default("0"),
    taxAmount: money("tax_amount").notNull().default("0"),
    totalTTC: money("total_ttc").notNull().default("0"),
    ...timestamps,
  },
  (t) => [index("quote_lines_quote_idx").on(t.quoteId)],
);

export const invoices = pgTable(
  "invoices",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    kind: documentKindEnum("kind").notNull().default("INVOICE"),
    /** Null tant que la facture est un brouillon : aucun numéro consommé (§28). */
    number: text("number"),
    businessStatus: invoiceBusinessStatusEnum("business_status").notNull().default("DRAFT"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("UNPAID"),
    electronicStatus: electronicInvoiceStatusEnum("electronic_status")
      .notNull()
      .default("NOT_APPLICABLE"),
    issueDate: date("issue_date").notNull(),
    dueDate: date("due_date"),
    supplyDate: date("supply_date"),
    currency: text("currency").notNull().default("EUR"),
    globalDiscountPercent: rate("global_discount_percent").notNull().default("0"),
    totalHT: money("total_ht").notNull().default("0"),
    totalTax: money("total_tax").notNull().default("0"),
    totalTTC: money("total_ttc").notNull().default("0"),
    amountPaid: money("amount_paid").notNull().default("0"),
    balanceDue: money("balance_due").notNull().default("0"),
    vatBreakdown: jsonb("vat_breakdown").$type<unknown[]>().notNull().default([]),
    /** §29 — snapshot figé des données du vendeur et de l'acheteur à la finalisation. */
    partySnapshot: jsonb("party_snapshot").$type<Record<string, unknown> | null>(),
    purchaseOrderRef: text("purchase_order_ref"),
    notes: text("notes"),
    footerNote: text("footer_note"),
    pdfBlobUrl: text("pdf_blob_url"),
    sourceQuoteId: uuid("source_quote_id").references(() => quotes.id, { onDelete: "set null" }),
    /** Pour un avoir : facture rectifiée. */
    correctedInvoiceId: uuid("corrected_invoice_id"),
    issuedAt: timestamp("issued_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdByUserId: text("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("invoices_org_number_key").on(t.organizationId, t.number),
    index("invoices_org_status_idx").on(t.organizationId, t.businessStatus),
    index("invoices_org_payment_idx").on(t.organizationId, t.paymentStatus),
    index("invoices_org_customer_idx").on(t.organizationId, t.customerId),
    index("invoices_org_due_idx").on(t.organizationId, t.dueDate),
    index("invoices_org_issue_idx").on(t.organizationId, t.issueDate),
  ],
);

export const invoiceLines = pgTable(
  "invoice_lines",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    unit: text("unit").notNull().default("unité"),
    quantity: quantity("quantity").notNull().default("1"),
    unitPriceHT: money("unit_price_ht").notNull().default("0"),
    discountPercent: rate("discount_percent").notNull().default("0"),
    taxRateId: text("tax_rate_id").notNull(),
    netHT: money("net_ht").notNull().default("0"),
    taxAmount: money("tax_amount").notNull().default("0"),
    totalTTC: money("total_ttc").notNull().default("0"),
    ...timestamps,
  },
  (t) => [index("invoice_lines_invoice_idx").on(t.invoiceId)],
);

export const payments = pgTable(
  "payments",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
    direction: text("direction").notNull().default("INBOUND"),
    method: paymentMethodEnum("method").notNull().default("BANK_TRANSFER"),
    amount: money("amount").notNull(),
    currency: text("currency").notNull().default("EUR"),
    receivedAt: date("received_at").notNull(),
    reference: text("reference"),
    notes: text("notes"),
    createdByUserId: text("created_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    index("payments_org_idx").on(t.organizationId),
    index("payments_org_date_idx").on(t.organizationId, t.receivedAt),
  ],
);

/** §35 — Un paiement peut être réparti sur plusieurs factures. */
export const paymentAllocations = pgTable(
  "payment_allocations",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    paymentId: uuid("payment_id")
      .notNull()
      .references(() => payments.id, { onDelete: "cascade" }),
    invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }),
    incomingInvoiceId: uuid("incoming_invoice_id"),
    amount: money("amount").notNull(),
    ...timestamps,
  },
  (t) => [
    index("payment_allocations_payment_idx").on(t.paymentId),
    index("payment_allocations_invoice_idx").on(t.invoiceId),
  ],
);

export const incomingInvoices = pgTable(
  "incoming_invoices",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    supplierId: uuid("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
    number: text("number"),
    issueDate: date("issue_date"),
    dueDate: date("due_date"),
    totalHT: money("total_ht").notNull().default("0"),
    totalTax: money("total_tax").notNull().default("0"),
    totalTTC: money("total_ttc").notNull().default("0"),
    amountPaid: money("amount_paid").notNull().default("0"),
    currency: text("currency").notNull().default("EUR"),
    status: incomingInvoiceStatusEnum("status").notNull().default("RECEIVED"),
    /** §34 — format constaté à l'import, jamais présumé. */
    detectedFormat: electronicFormatEnum("detected_format").notNull().default("UNKNOWN"),
    sourceBlobUrl: text("source_blob_url"),
    extractedData: jsonb("extracted_data").$type<Record<string, unknown> | null>(),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    index("incoming_invoices_org_idx").on(t.organizationId),
    index("incoming_invoices_org_status_idx").on(t.organizationId, t.status),
  ],
);

export const attachments = pgTable(
  "attachments",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    filename: text("filename").notNull(),
    contentType: text("content_type").notNull(),
    sizeBytes: integer("size_bytes").notNull().default(0),
    /** §6 — chemin Blob privé ; jamais d'URL publique permanente. */
    blobPathname: text("blob_pathname").notNull(),
    checksumSha256: text("checksum_sha256"),
    uploadedByUserId: text("uploaded_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ...timestamps,
  },
  (t) => [
    index("attachments_org_entity_idx").on(t.organizationId, t.entityType, t.entityId),
  ],
);
