import { and, eq, type SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

/**
 * §41 / §97 — Isolation multi-tenant.
 *
 * Règle : aucune requête métier n'est écrite sans passer par `scoped()`.
 * L'organizationId provient TOUJOURS de la session résolue côté serveur,
 * jamais d'un champ transmis par le navigateur.
 */

export class TenantIsolationError extends Error {
  constructor(message = "Accès refusé : ressource hors de votre organisation") {
    super(message);
    this.name = "TenantIsolationError";
  }
}

/** Combine le filtre d'organisation obligatoire avec des conditions additionnelles. */
export function scoped(
  organizationColumn: PgColumn,
  organizationId: string,
  ...conditions: (SQL | undefined)[]
): SQL {
  const filters = [eq(organizationColumn, organizationId), ...conditions].filter(
    (c): c is SQL => c !== undefined,
  );
  const combined = and(...filters);
  if (!combined) throw new TenantIsolationError("Filtre de tenant invalide");
  return combined;
}

/**
 * Vérification défensive après lecture : si une ligne obtenue par un autre
 * chemin ne porte pas la bonne organisation, on refuse plutôt que de servir.
 */
export function assertBelongsTo<T extends { organizationId: string }>(
  row: T | null | undefined,
  organizationId: string,
): T {
  if (!row || row.organizationId !== organizationId) {
    throw new TenantIsolationError();
  }
  return row;
}
