import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { idColumn, timestamps } from "./_shared";
import {
  invitationStatusEnum,
  membershipStatusEnum,
  organizationRoleEnum,
  platformRoleEnum,
} from "./enums";

/** Tables Better Auth (user / session / account / verification) + extensions Aequitas. */

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    /** §98 — rôle plateforme, jamais confondu avec un rôle organisation. */
    platformRole: platformRoleEnum("platform_role").notNull().default("USER"),
    twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
    locale: text("locale").notNull().default("fr-FR"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_key").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    /** Organisation active de la session, résolue côté serveur uniquement (§41). */
    activeOrganizationId: uuid("active_organization_id"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("sessions_token_key").on(t.token),
    index("sessions_user_idx").on(t.userId),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"),
    ...timestamps,
  },
  (t) => [
    index("accounts_user_idx").on(t.userId),
    uniqueIndex("accounts_provider_key").on(t.providerId, t.accountId),
  ],
);

export const verifications = pgTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ...timestamps,
  },
  (t) => [index("verifications_identifier_idx").on(t.identifier)],
);

export const organizations = pgTable(
  "organizations",
  {
    id: idColumn(),
    slug: text("slug").notNull(),
    legalName: text("legal_name").notNull(),
    tradeName: text("trade_name"),
    legalForm: text("legal_form"),
    siren: text("siren"),
    siret: text("siret"),
    vatNumber: text("vat_number"),
    rcsCity: text("rcs_city"),
    shareCapital: text("share_capital"),
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    postalCode: text("postal_code"),
    city: text("city"),
    country: text("country").notNull().default("FR"),
    email: text("email"),
    phone: text("phone"),
    website: text("website"),
    logoBlobUrl: text("logo_blob_url"),
    onboardingStep: text("onboarding_step").notNull().default("company"),
    onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("organizations_slug_key").on(t.slug),
    index("organizations_siren_idx").on(t.siren),
  ],
);

export const memberships = pgTable(
  "memberships",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: organizationRoleEnum("role").notNull().default("READ_ONLY"),
    status: membershipStatusEnum("status").notNull().default("ACTIVE"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("memberships_org_user_key").on(t.organizationId, t.userId),
    index("memberships_user_idx").on(t.userId),
  ],
);

export const invitations = pgTable(
  "invitations",
  {
    id: idColumn(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: organizationRoleEnum("role").notNull().default("READ_ONLY"),
    /** §99 — seul le hash du jeton est stocké. */
    tokenHash: text("token_hash").notNull(),
    status: invitationStatusEnum("status").notNull().default("PENDING"),
    invitedByUserId: text("invited_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("invitations_token_key").on(t.tokenHash),
    index("invitations_org_idx").on(t.organizationId),
    index("invitations_email_idx").on(t.email),
  ],
);

export const organizationSettings = pgTable(
  "organization_settings",
  {
    organizationId: uuid("organization_id")
      .primaryKey()
      .references(() => organizations.id, { onDelete: "cascade" }),
    invoicePrefix: text("invoice_prefix").notNull().default("AEQ"),
    quotePrefix: text("quote_prefix").notNull().default("DEV"),
    creditNotePrefix: text("credit_note_prefix").notNull().default("AVO"),
    currency: text("currency").notNull().default("EUR"),
    defaultTaxRateId: text("default_tax_rate_id").notNull().default("fr-standard-20"),
    defaultPaymentTermsDays: text("default_payment_terms_days").notNull().default("30"),
    latePenaltyMention: text("late_penalty_mention"),
    /** Coordonnées bancaires : IBAN jamais journalisé en clair (§67). */
    iban: text("iban"),
    bic: text("bic"),
    bankName: text("bank_name"),
    invoiceFooterNote: text("invoice_footer_note"),
    notificationPreferences: jsonb("notification_preferences")
      .$type<Record<string, boolean>>()
      .notNull()
      .default({}),
    ...timestamps,
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  sessions: many(sessions),
}));

export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  memberships: many(memberships),
  settings: one(organizationSettings, {
    fields: [organizations.id],
    references: [organizationSettings.organizationId],
  }),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  organization: one(organizations, {
    fields: [memberships.organizationId],
    references: [organizations.id],
  }),
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
}));
