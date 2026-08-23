import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { getDb, schema } from "@/src/database/client";
import { appUrl, serverEnv } from "@/src/lib/env";

/**
 * §7 — Better Auth sur Neon.
 * MFA et passkeys sont ajoutés via plugins une fois le socle validé
 * (voir docs/security/authentication.md).
 */

function createAuth() {
  const env = serverEnv();
  return betterAuth({
    secret: env.AUTH_SECRET,
    baseURL: appUrl(),
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION === "true",
      minPasswordLength: 12,
      autoSignIn: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: true, maxAge: 60 * 5 },
    },
    advanced: {
      cookiePrefix: "aequitas",
      useSecureCookies: process.env.NODE_ENV === "production",
      defaultCookieAttributes: { sameSite: "lax", httpOnly: true },
    },
    user: {
      additionalFields: {
        platformRole: { type: "string", defaultValue: "USER", input: false },
        locale: { type: "string", defaultValue: "fr-FR", input: false },
      },
    },
    rateLimit: { enabled: true, window: 60, max: 20 },
    plugins: [nextCookies()],
  });
}

type AequitasAuth = ReturnType<typeof createAuth>;

let authInstance: AequitasAuth | null = null;

export function getAuth(): AequitasAuth {
  authInstance ??= createAuth();
  return authInstance;
}
