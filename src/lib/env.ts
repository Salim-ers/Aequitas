import { z } from "zod";

/**
 * §59 — Tous les secrets viennent de Vercel Environment Variables.
 * La validation est paresseuse : un build ne doit pas échouer parce qu'une
 * intégration optionnelle n'est pas encore branchée.
 */

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
      APP_URL:
        process.env.APP_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : undefined),
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
  const base =
    process.env.APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
  return `${base.replace(/\/$/, "")}${path}`;
}
