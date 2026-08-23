import { headers } from "next/headers";
import { getDb } from "@/src/database/client";
import { auditEvents } from "@/src/database/schema";

/** §45 — Journal append-only. Aucune fonction d'update ni de delete n'est exposée. */

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "USER_INVITED"
  | "ROLE_CHANGED"
  | "MEMBER_REMOVED"
  | "CUSTOMER_CREATED"
  | "CUSTOMER_UPDATED"
  | "CUSTOMER_DELETED"
  | "SUPPLIER_CREATED"
  | "PRODUCT_CREATED"
  | "QUOTE_CREATED"
  | "QUOTE_SENT"
  | "QUOTE_CONVERTED"
  | "INVOICE_CREATED"
  | "INVOICE_FINALIZED"
  | "INVOICE_SENT"
  | "INVOICE_DOWNLOADED"
  | "INVOICE_CANCELLED"
  | "CREDIT_NOTE_CREATED"
  | "PAYMENT_CREATED"
  | "SUBSCRIPTION_CHANGED"
  | "API_KEY_CREATED"
  | "API_KEY_REVOKED"
  | "WEBHOOK_CREATED"
  | "SETTINGS_CHANGED"
  | "EXPORT_REQUESTED"
  | "TRANSMISSION_REQUESTED";

export interface AuditInput {
  organizationId: string | null;
  actorUserId: string | null;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  actorType?: "USER" | "API_KEY" | "SYSTEM";
}

/** Champs jamais journalisés (§67). */
const FORBIDDEN_KEYS = new Set([
  "password", "token", "otp", "secret", "iban", "bic", "xml", "pdf",
  "cardNumber", "card", "apiKey", "authorization",
]);

function sanitize(metadata: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
      clean[key] = "[redacted]";
      continue;
    }
    if (typeof value === "string" && value.length > 512) {
      clean[key] = `${value.slice(0, 512)}…`;
      continue;
    }
    clean[key] = value;
  }
  return clean;
}

export async function recordAuditEvent(input: AuditInput): Promise<void> {
  let ipAddress: string | null = null;
  let userAgent: string | null = null;
  try {
    const h = await headers();
    ipAddress = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    userAgent = h.get("user-agent");
  } catch {
    // Hors contexte de requête (job cron) : on journalise sans en-têtes.
  }

  await getDb()
    .insert(auditEvents)
    .values({
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      actorType: input.actorType ?? "USER",
      action: input.action,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      ipAddress,
      userAgent,
      metadata: sanitize(input.metadata ?? {}),
      occurredAt: new Date(),
    });
}

export const AUDIT_LABELS: Readonly<Record<string, string>> = {
  LOGIN: "Connexion",
  LOGOUT: "Déconnexion",
  USER_INVITED: "Utilisateur invité",
  ROLE_CHANGED: "Rôle modifié",
  MEMBER_REMOVED: "Membre retiré",
  CUSTOMER_CREATED: "Client créé",
  CUSTOMER_UPDATED: "Client modifié",
  CUSTOMER_DELETED: "Client supprimé",
  SUPPLIER_CREATED: "Fournisseur créé",
  PRODUCT_CREATED: "Article créé",
  QUOTE_CREATED: "Devis créé",
  QUOTE_SENT: "Devis envoyé",
  QUOTE_CONVERTED: "Devis converti en facture",
  INVOICE_CREATED: "Facture créée",
  INVOICE_FINALIZED: "Facture finalisée",
  INVOICE_SENT: "Facture envoyée",
  INVOICE_DOWNLOADED: "Facture téléchargée",
  INVOICE_CANCELLED: "Facture annulée",
  CREDIT_NOTE_CREATED: "Avoir créé",
  PAYMENT_CREATED: "Paiement enregistré",
  SUBSCRIPTION_CHANGED: "Abonnement modifié",
  API_KEY_CREATED: "Clé API créée",
  API_KEY_REVOKED: "Clé API révoquée",
  WEBHOOK_CREATED: "Webhook créé",
  SETTINGS_CHANGED: "Paramètres modifiés",
  EXPORT_REQUESTED: "Export demandé",
  TRANSMISSION_REQUESTED: "Transmission demandée",
};
