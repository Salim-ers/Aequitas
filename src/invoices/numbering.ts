import { sql } from "drizzle-orm";
import type { Database } from "@/src/database/client";

/**
 * §28 — Numérotation séquentielle sans trou ni doublon.
 *
 * La réservation se fait dans la transaction qui finalise le document :
 * `SELECT ... FOR UPDATE` sérialise les concurrents sur la ligne de séquence,
 * et l'index unique (organization_id, number) est le garde-fou final.
 *
 * Format : PREFIX-YYYY-NNNNNN → AEQ-2026-000001
 */

export type DocumentKind = "QUOTE" | "INVOICE" | "CREDIT_NOTE";

export interface NumberingOptions {
  prefix: string;
  padding?: number;
  year?: number;
}

export class NumberingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NumberingError";
  }
}

/**
 * À appeler UNIQUEMENT à l'intérieur d'une transaction (`db.transaction`).
 * Consomme un numéro et renvoie sa représentation textuelle.
 */
export async function reserveDocumentNumber(
  tx: Database,
  organizationId: string,
  kind: DocumentKind,
  options: NumberingOptions,
): Promise<string> {
  const year = options.year ?? new Date().getUTCFullYear();
  const padding = options.padding ?? 6;
  const prefix = options.prefix.trim().toUpperCase();

  if (!/^[A-Z0-9]{1,10}$/.test(prefix)) {
    throw new NumberingError(
      "Préfixe invalide : 1 à 10 caractères alphanumériques majuscules",
    );
  }

  // Crée la séquence si absente, puis la verrouille pour la durée de la transaction.
  await tx.execute(sql`
    insert into invoice_sequences (organization_id, kind, year, prefix, padding, next_value)
    values (${organizationId}::uuid, ${kind}::document_kind, ${year}, ${prefix}, ${padding}, 1)
    on conflict (organization_id, kind, year) do nothing
  `);

  const result = await tx.execute<{ next_value: number; prefix: string; padding: number }>(sql`
    update invoice_sequences
       set next_value = next_value + 1,
           updated_at = now()
     where organization_id = ${organizationId}::uuid
       and kind = ${kind}::document_kind
       and year = ${year}
    returning next_value - 1 as next_value, prefix, padding
  `);

  const row = result.rows[0];
  if (!row) {
    throw new NumberingError("Impossible de réserver un numéro de document");
  }

  return formatDocumentNumber(row.prefix, year, row.next_value, row.padding);
}

export function formatDocumentNumber(
  prefix: string,
  year: number,
  value: number,
  padding = 6,
): string {
  return `${prefix}-${year}-${String(value).padStart(padding, "0")}`;
}

/** Lecture seule : prochain numéro affiché dans l'éditeur, sans le consommer. */
export async function peekNextDocumentNumber(
  db: Database,
  organizationId: string,
  kind: DocumentKind,
  options: NumberingOptions,
): Promise<string> {
  const year = options.year ?? new Date().getUTCFullYear();
  const result = await db.execute<{ next_value: number; prefix: string; padding: number }>(sql`
    select next_value, prefix, padding
      from invoice_sequences
     where organization_id = ${organizationId}::uuid
       and kind = ${kind}::document_kind
       and year = ${year}
     limit 1
  `);
  const row = result.rows[0];
  if (!row) {
    return formatDocumentNumber(options.prefix, year, 1, options.padding ?? 6);
  }
  return formatDocumentNumber(row.prefix, year, row.next_value, row.padding);
}
