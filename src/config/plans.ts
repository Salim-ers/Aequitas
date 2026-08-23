/**
 * §13 / §112 — Source de vérité unique des offres.
 * Modifier un prix ici et dans Stripe ; jamais en dur ailleurs.
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
  | "priority_support";

export type LimitKey =
  | "invoices_per_month"
  | "users"
  | "organizations"
  | "api_requests_per_month"
  | "storage_mb";

/** -1 = illimité / négocié au contrat. */
export type LimitValue = number;

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
  /** Ce que le client lit sur la page tarifs. */
  readonly bullets: readonly string[];
}

export const TRIAL_DAYS_DEFAULT = Number(process.env.TRIAL_DAYS ?? 14);

export const PLANS: Readonly<Record<PlanSlug, Plan>> = {
  essentiel: {
    slug: "essentiel",
    name: "Essentiel",
    tagline: "Pour démarrer proprement.",
    monthlyPriceCents: 2900,
    yearlyPriceCents: 29000,
    currency: "EUR",
    stripePriceIdMonthly: process.env.STRIPE_PRICE_ESSENTIAL,
    stripePriceIdYearly: process.env.STRIPE_PRICE_ESSENTIAL_YEARLY,
    highlighted: false,
    trialDays: TRIAL_DAYS_DEFAULT,
    features: ["quotes", "invoices", "credit_notes", "suppliers", "exports", "factur_x"],
    limits: {
      invoices_per_month: 100,
      users: 1,
      organizations: 1,
      api_requests_per_month: 0,
      storage_mb: 2048,
    },
    bullets: [
      "1 entreprise, 1 utilisateur",
      "100 factures par mois",
      "Devis, factures, avoirs",
      "Clients et fournisseurs",
      "Exports CSV et PDF",
      "Génération Factur-X",
    ],
  },
  pro: {
    slug: "pro",
    name: "Pro",
    tagline: "Pour une équipe qui facture tous les jours.",
    monthlyPriceCents: 7900,
    yearlyPriceCents: 79000,
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
    ],
    limits: {
      invoices_per_month: 1000,
      users: 5,
      organizations: 1,
      api_requests_per_month: 50_000,
      storage_mb: 10_240,
    },
    bullets: [
      "1 entreprise, 5 utilisateurs",
      "1 000 factures par mois",
      "Factures récurrentes et relances",
      "API et webhooks",
      "Journal d'audit",
      "Import de factures fournisseurs",
    ],
  },
  business: {
    slug: "business",
    name: "Business",
    tagline: "Pour plusieurs entités et des volumes élevés.",
    monthlyPriceCents: 19900,
    yearlyPriceCents: 199000,
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
    ],
    limits: {
      invoices_per_month: 10_000,
      users: 20,
      organizations: 3,
      api_requests_per_month: 500_000,
      storage_mb: 51_200,
    },
    bullets: [
      "3 entreprises, 20 utilisateurs",
      "10 000 factures par mois",
      "API avancée et permissions fines",
      "Exports comptables",
      "Intégrations",
      "Support prioritaire",
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
    ],
    limits: {
      invoices_per_month: -1,
      users: -1,
      organizations: -1,
      api_requests_per_month: -1,
      storage_mb: -1,
    },
    bullets: [
      "Volumes personnalisés",
      "SSO et multi-entités",
      "SLA contractuel",
      "Intégrations sur mesure",
      "Accompagnement dédié",
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
