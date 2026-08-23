/**
 * §67 — Logs structurés, avec liste noire stricte.
 * Rien de ce qui touche à un secret, un IBAN complet, un XML ou un PDF
 * de facture ne doit se retrouver dans un log.
 */

type Level = "debug" | "info" | "warn" | "error";

const REDACTED = "[redacted]";

const FORBIDDEN_KEYS = [
  "password", "token", "accesstoken", "refreshtoken", "otp", "secret",
  "authorization", "cookie", "apikey", "api_key", "stripe_secret",
  "iban", "bic", "cardnumber", "card", "cvc", "xml", "pdf",
  "documentcontent", "identitydocument",
];

function redact(value: unknown, depth = 0): unknown {
  if (depth > 4) return "[depth-limit]";
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.slice(0, 20).map((v) => redact(v, depth + 1));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
      if (FORBIDDEN_KEYS.includes(key.toLowerCase())) {
        out[key] = REDACTED;
        continue;
      }
      out[key] = redact(v, depth + 1);
    }
    return out;
  }
  if (typeof value === "string" && value.length > 1000) {
    return `${value.slice(0, 1000)}…[truncated]`;
  }
  return value;
}

/** Un IBAN n'apparaît jamais en entier, même volontairement. */
export function maskIban(iban: string | null | undefined): string {
  if (!iban) return "—";
  const clean = iban.replace(/\s/g, "");
  if (clean.length < 8) return REDACTED;
  return `${clean.slice(0, 4)}…${clean.slice(-4)}`;
}

function emit(level: Level, event: string, context: Record<string, unknown> = {}): void {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    env: process.env.VERCEL_ENV ?? "development",
    ...(redact(context) as Record<string, unknown>),
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (event: string, context?: Record<string, unknown>) => emit("debug", event, context),
  info: (event: string, context?: Record<string, unknown>) => emit("info", event, context),
  warn: (event: string, context?: Record<string, unknown>) => emit("warn", event, context),
  error: (event: string, context?: Record<string, unknown>) => emit("error", event, context),
};
