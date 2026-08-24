/**
 * §13 / §112 — Source de vérité unique des offres.
 *
 * ATTENTION — `monthlyPriceCents` n'est QUE l'affichage. Le montant
 * réellement prélevé vient de `stripePriceIdMonthly`, c'est-à-dire du tarif
 * créé dans Stripe. Modifier l'un sans l'autre fait voir un prix au client
 * et lui en facturer un autre.
 *
 * Toute baisse de prix suppose donc : créer le nouveau tarif dans Stripe,
 * mettre à jour la variable STRIPE_PRICE_* correspondante, puis seulement
 * ajuster la valeur ci-dessous.
 */

export type PlanSlug = "essentiel" | "pro" | "business" | "enterprise";

export type FeatureKey =
  | "quotes"
  | "invoices"
  | "credit_notes"
  | "suppliers"
  | "exports"
  | "factur_x"
  | "recurring_invoices"
  | "automated_reminders"
  | "api_access"
  | "webhooks"
  | "audit_log"
  | "e_reporting"
  | "supplier_import"
  | "advanced_reporting"
  | "advanced_permissions"
  | "accounting_export"
  | "sso"
  | "priority_support"
  | "bank_reconciliation"
  | "client_portal"
  | "supplier_ocr"
  | "accountant_access";

export type LimitKey =
  | "invoices_per_month"
  | "users"
  | "organizations"
  | "api_requests_per_month"
  | "storage_mb";

/** -1 = illimité / négocié au contrat. */
export type LimitValue = number;

export interface PlanBullet {
  readonly label: string;
  readonly soon?: boolean;
}

export interface Plan {
  readonly slug: PlanSlug;
  readonly name: string;
  readonly tagline: string;
  /** Prix mensuel HT en centimes d'euro. null = sur devis. */
  readonly monthlyPriceCents: number | null;
  readonly yearlyPriceCents: number | null;
  readonly currency: "EUR";
  /** Renseigné par variable d'environnement Vercel (§111). */
  readonly stripePriceIdMonthly: string | undefined;
  readonly stripePriceIdYearly: string | undefined;
  readonly highlighted: boolean;
  readonly trialDays: number;
  readonly features: readonly FeatureKey[];
  readonly limits: Readonly<Record<LimitKey, LimitValue>>;
  /**
   * Ce que le client lit sur la page tarifs.
   * `soon` marque une ligne incluse dans l'offre mais pas encore livrée :
   * elle ne doit jamais apparaître comme disponible (voir src/content/status.ts).
   */
  readonly bullets: readonly PlanBullet[];
}

export const TRIAL_DAYS_DEFAULT = Number(process.env.TRIAL_DAYS ?? 14);

export const PLANS: Readonly<Record<PlanSlug, Plan>> = {
  essentiel: {
    slug: "essentiel",
    name: "Essentiel",
    tagline: "Tout ce qu'il faut pour facturer, sans surcoût.",
    monthlyPriceCents: 1900,
    yearlyPriceCents: 19000,
    currency: "EUR",
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ESSENTIAL,
    stripePriceIdYearly: process.env.STRIPE_PRICE_ESSENTIAL_YEARLY,
    highlighted: false,
    trialDays: TRIAL_DAYS_DEFAULT,
    features: [
      "quotes",
      "invoices",
      "credit_notes",
      "suppliers",
      "exports",
      "factur_x",
      "client_portal",
    ],
    limits: {
      invoices_per_month: 100,
      users: 1,
      organizations: 1,
      api_requests_per_month: 0,
      storage_mb: 2048,
    },
    bullets: [
      { label: "1 entreprise, 1 utilisateur" },
      { label: "100 factures par mois" },
      { label: "Journal d'audit" },
      { label: "Devis, factures, avoirs", soon: true },
      { label: "Clients et fournisseurs", soon: true },
      { label: "Portail client", soon: true },
      { label: "Exports CSV et PDF", soon: true },
    ],
  },
  pro: {
    slug: "pro",
    name: "Pro",
    tagline: "Pour une équipe qui facture tous les jours.",
    monthlyPriceCents: 4900,
    yearlyPriceCents: 49000,
    currency: "EUR",
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO,
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY,
    highlighted: true,
    trialDays: TRIAL_DAYS_DEFAULT,
    features: [
      "quotes",
      "invoices",
      "credit_notes",
      "suppliers",
      "exports",
      "factur_x",
      "recurring_invoices",
      "automated_reminders",
      "api_access",
      "webhooks",
      "audit_log",
      "e_reporting",
      "supplier_import",
      "client_portal",
      "bank_reconciliation",
      "supplier_ocr",
      "accountant_access",
    ],
    limits: {
      invoices_per_month: 1000,
      users: 5,
      organizations: 1,
      api_requests_per_month: 50_000,
      storage_mb: 10_240,
    },
    bullets: [
      { label: "1 entreprise, 5 utilisateurs" },
      { label: "1 000 factures par mois" },
      { label: "Rôles et permissions avancées" },
      { label: "Journal d'audit" },
      { label: "Accès expert-comptable", soon: true },
      { label: "Rapprochement bancaire", soon: true },
      { label: "Factures récurrentes et relances", soon: true },
      { label: "API et webhooks", soon: true },
    ],
  },
  business: {
    slug: "business",
    name: "Business",
    tagline: "Pour plusieurs entités et des volumes élevés.",
    monthlyPriceCents: 11900,
    yearlyPriceCents: 119000,
    currency: "EUR",
    stripePriceIdMonthly: process.env.STRIPE_PRICE_BUSINESS,
    stripePriceIdYearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY,
    highlighted: false,
    trialDays: TRIAL_DAYS_DEFAULT,
    features: [
      "quotes",
      "invoices",
      "credit_notes",
      "suppliers",
      "exports",
      "factur_x",
      "recurring_invoices",
      "automated_reminders",
      "api_access",
      "webhooks",
      "audit_log",
      "e_reporting",
      "supplier_import",
      "advanced_reporting",
      "advanced_permissions",
      "accounting_export",
      "priority_support",
      "client_portal",
      "bank_reconciliation",
      "supplier_ocr",
      "accountant_access",
    ],
    limits: {
      invoices_per_month: 10_000,
      users: 20,
      organizations: 3,
      api_requests_per_month: 500_000,
      storage_mb: 51_200,
    },
    bullets: [
      { label: "3 entreprises, 20 utilisateurs" },
      { label: "10 000 factures par mois" },
      { label: "Rôles et permissions avancées" },
      { label: "Support prioritaire" },
      { label: "Lecture automatique des factures reçues", soon: true },
      { label: "Exports comptables", soon: true },
      { label: "API avancée et intégrations", soon: true },
    ],
  },
  enterprise: {
    slug: "enterprise",
    name: "Enterprise",
    tagline: "Pour les groupes et les volumes contractualisés.",
    monthlyPriceCents: null,
    yearlyPriceCents: null,
    currency: "EUR",
    stripePriceIdMonthly: undefined,
    stripePriceIdYearly: undefined,
    highlighted: false,
    trialDays: 0,
    features: [
      "quotes",
      "invoices",
      "credit_notes",
      "suppliers",
      "exports",
      "factur_x",
      "recurring_invoices",
      "automated_reminders",
      "api_access",
      "webhooks",
      "audit_log",
      "e_reporting",
      "supplier_import",
      "advanced_reporting",
      "advanced_permissions",
      "accounting_export",
      "sso",
      "priority_support",
      "client_portal",
      "bank_reconciliation",
      "supplier_ocr",
      "accountant_access",
    ],
    limits: {
      invoices_per_month: -1,
      users: -1,
      organizations: -1,
      api_requests_per_month: -1,
      storage_mb: -1,
    },
    bullets: [
      { label: "Volumes personnalisés" },
      { label: "Accompagnement dédié" },
      { label: "SLA contractuel" },
      { label: "Multi-entités et SSO", soon: true },
      { label: "Intégrations sur mesure", soon: true },
    ],
  },
} as const;

export const PLAN_ORDER: readonly PlanSlug[] = ["essentiel", "pro", "business", "enterprise"];

export function getPlan(slug: string): Plan {
  const plan = PLANS[slug as PlanSlug];
  if (!plan) throw new Error(`Offre inconnue : ${slug}`);
  return plan;
}

/** Retrouve l'offre à partir d'un price Stripe (utilisé par le webhook). */
export function planFromStripePriceId(priceId: string): Plan | null {
  for (const slug of PLAN_ORDER) {
    const plan = PLANS[slug];
    if (plan.stripePriceIdMonthly === priceId || plan.stripePriceIdYearly === priceId) {
      return plan;
    }
  }
  return null;
}

export function formatPlanPrice(plan: Plan, period: "monthly" | "yearly" = "monthly"): string {
  const cents = period === "monthly" ? plan.monthlyPriceCents : plan.yearlyPriceCents;
  if (cents === null) return "Sur devis";
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: plan.currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
