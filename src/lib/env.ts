import { z } from "zod";

/**
 * §59 — Tous les secrets viennent de Vercel Environment Variables.
 * La validation est paresseuse : un build ne doit pas échouer parce qu'une
 * intégration optionnelle n'est pas encore branchée.
 */

const DEFAULT_APP_URL = "https://aequitas.fr";

/** Une variable Vercel non renseignée arrive sous forme de chaîne vide, pas d'undefined. */
function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/** APP_URL est censée être une URL complète : on refuse tout ce qui n'en est pas une. */
function asFullUrl(value: string | undefined): string | undefined {
  if (!value || !URL.canParse(value)) return undefined;
  const { protocol } = new URL(value);
  return protocol === "https:" || protocol === "http:" ? value : undefined;
}

/** Les variables VERCEL_* contiennent un hôte nu (`mon-app.vercel.app`). */
function asVercelHost(value: string | undefined): string | undefined {
  return value ? asFullUrl(`https://${value}`) : undefined;
}

/**
 * Base URL de l'application, sans slash final.
 * Ne lève jamais : le build ne doit pas casser si APP_URL est vide ou invalide.
 */
export function baseUrl(): string {
  const resolved =
    asFullUrl(readEnv("APP_URL")) ??
    asVercelHost(readEnv("VERCEL_PROJECT_PRODUCTION_URL")) ??
    asVercelHost(readEnv("VERCEL_URL")) ??
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : DEFAULT_APP_URL);
  return resolved.replace(/\/$/, "");
}

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  APP_URL: z.string().url(),
});

const stripeSchema = z.object({
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type StripeEnv = z.infer<typeof stripeSchema>;

export class MissingEnvironmentError extends Error {
  constructor(public readonly variables: string[]) {
    super(
      `Variables d'environnement manquantes dans Vercel : ${variables.join(", ")}`,
    );
    this.name = "MissingEnvironmentError";
  }
}

function parseOrThrow<T extends z.ZodTypeAny>(schema: T, source: unknown): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    throw new MissingEnvironmentError(
      result.error.issues.map((i) => i.path.join(".")),
    );
  }
  return result.data;
}

let serverEnvCache: ServerEnv | null = null;
export function serverEnv(): ServerEnv {
  if (!serverEnvCache) {
    serverEnvCache = parseOrThrow(serverSchema, {
      DATABASE_URL: process.env.DATABASE_URL,
      AUTH_SECRET: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
      APP_URL: baseUrl(),
    });
  }
  return serverEnvCache;
}

let stripeEnvCache: StripeEnv | null = null;
export function stripeEnv(): StripeEnv {
  if (!stripeEnvCache) {
    stripeEnvCache = parseOrThrow(stripeSchema, {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    });
  }
  return stripeEnvCache;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function isDemoSeedEnabled(): boolean {
  return process.env.DEMO_SEED_ENABLED === "true" && process.env.VERCEL_ENV !== "production";
}

export function appUrl(path = ""): string {
  return `${baseUrl()}${path}`;
}
