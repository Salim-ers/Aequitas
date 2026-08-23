import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/src/database/client";
import { subscriptions, usageMetrics } from "@/src/database/schema";
import {
  getPlan,
  type FeatureKey,
  type LimitKey,
  type Plan,
  type PlanSlug,
} from "@/src/config/plans";

/**
 * §18 / §19 / §20 — Point d'entrée unique des droits.
 * Interdit ailleurs dans le code : `if (plan === "PRO")`.
 */

export type SubscriptionStatus =
  | "INCOMPLETE"
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "GRACE_PERIOD"
  | "SUSPENDED"
  | "CANCELED"
  | "INCOMPLETE_EXPIRED";

/** Statuts qui ouvrent l'accès applicatif. PAST_DUE et GRACE_PERIOD restent ouverts (§115). */
const ACCESS_GRANTING: readonly SubscriptionStatus[] = [
  "TRIALING",
  "ACTIVE",
  "PAST_DUE",
  "GRACE_PERIOD",
];

export interface Entitlements {
  organizationId: string;
  plan: Plan;
  status: SubscriptionStatus;
  hasAccess: boolean;
  trialEndsAt: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}

export async function getEntitlements(organizationId: string): Promise<Entitlements> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.organizationId, organizationId))
    .limit(1);

  const planSlug = (row?.plan ?? "essentiel") as PlanSlug;
  const status = (row?.status ?? "INCOMPLETE") as SubscriptionStatus;

  return {
    organizationId,
    plan: getPlan(planSlug),
    status,
    hasAccess: ACCESS_GRANTING.includes(status),
    trialEndsAt: row?.trialEndsAt ?? null,
    currentPeriodEnd: row?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: row?.cancelAtPeriodEnd ?? false,
  };
}

export async function canUseFeature(
  organizationId: string,
  feature: FeatureKey,
): Promise<boolean> {
  const entitlements = await getEntitlements(organizationId);
  if (!entitlements.hasAccess) return false;
  return entitlements.plan.features.includes(feature);
}

export class FeatureNotAvailableError extends Error {
  constructor(
    public readonly feature: FeatureKey,
    public readonly currentPlan: PlanSlug,
  ) {
    super(`Fonctionnalité « ${feature} » indisponible dans l'offre ${currentPlan}`);
    this.name = "FeatureNotAvailableError";
  }
}

export async function requireFeature(
  organizationId: string,
  feature: FeatureKey,
): Promise<void> {
  const entitlements = await getEntitlements(organizationId);
  if (!entitlements.plan.features.includes(feature)) {
    throw new FeatureNotAvailableError(feature, entitlements.plan.slug);
  }
}

export function currentPeriod(date: Date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export interface LimitCheck {
  metric: string;
  used: number;
  limit: number;
  unlimited: boolean;
  remaining: number;
  /** Ratio d'utilisation entre 0 et 1 ; 0 si illimité. */
  ratio: number;
  exceeded: boolean;
  /** §20 — déclenche la notification d'approche de quota. */
  nearingLimit: boolean;
}

const LIMIT_TO_METRIC: Readonly<Record<LimitKey, string>> = {
  invoices_per_month: "invoices_created",
  users: "users",
  organizations: "organizations",
  api_requests_per_month: "api_requests",
  storage_mb: "storage_mb",
};

const MONTHLY_METRICS = new Set(["invoices_created", "api_requests"]);

function periodFor(metric: string): string {
  return MONTHLY_METRICS.has(metric) ? currentPeriod() : "lifetime";
}

export async function checkLimit(
  organizationId: string,
  limitKey: LimitKey,
): Promise<LimitCheck> {
  const entitlements = await getEntitlements(organizationId);
  const limit = entitlements.plan.limits[limitKey];
  const metric = LIMIT_TO_METRIC[limitKey];
  const period = periodFor(metric);

  const db = getDb();
  const [row] = await db
    .select({ value: usageMetrics.value })
    .from(usageMetrics)
    .where(
      and(
        eq(usageMetrics.organizationId, organizationId),
        eq(usageMetrics.metric, metric),
        eq(usageMetrics.period, period),
      ),
    )
    .limit(1);

  const used = row?.value ?? 0;
  const unlimited = limit < 0;
  const remaining = unlimited ? Number.POSITIVE_INFINITY : Math.max(0, limit - used);
  const ratio = unlimited || limit === 0 ? 0 : used / limit;

  return {
    metric,
    used,
    limit,
    unlimited,
    remaining,
    ratio,
    exceeded: !unlimited && used >= limit,
    nearingLimit: !unlimited && ratio >= 0.8 && ratio < 1,
  };
}

export class LimitExceededError extends Error {
  constructor(
    public readonly limitKey: LimitKey,
    public readonly check: LimitCheck,
  ) {
    super(
      `Quota atteint : ${check.used} / ${check.limit}. Passez à l'offre supérieure pour continuer.`,
    );
    this.name = "LimitExceededError";
  }
}

export async function requireWithinLimit(
  organizationId: string,
  limitKey: LimitKey,
): Promise<LimitCheck> {
  const check = await checkLimit(organizationId, limitKey);
  if (check.exceeded) throw new LimitExceededError(limitKey, check);
  return check;
}

/** Incrément atomique : UPSERT avec `value = value + delta`. */
export async function incrementUsage(
  organizationId: string,
  metric: string,
  delta = 1,
): Promise<number> {
  const db = getDb();
  const period = periodFor(metric);
  const [row] = await db
    .insert(usageMetrics)
    .values({ organizationId, metric, period, value: delta })
    .onConflictDoUpdate({
      target: [usageMetrics.organizationId, usageMetrics.metric, usageMetrics.period],
      set: {
        value: sql`${usageMetrics.value} + ${delta}`,
        updatedAt: sql`now()`,
      },
    })
    .returning({ value: usageMetrics.value });
  return row?.value ?? 0;
}
