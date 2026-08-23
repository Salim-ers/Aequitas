/** §124 — Aucune donnée réglementaire n'est inventée. */
export class RegulatoryConfigurationError extends Error {
  constructor(
    message = "Official specification required",
    public readonly detail?: string,
  ) {
    super(detail ? `${message} — ${detail}` : message);
    this.name = "RegulatoryConfigurationError";
  }
}

/** Marqueur explicite pour les points en attente de spécification officielle. */
export const PENDING_OFFICIAL_SPEC = "PENDING_OFFICIAL_SPEC" as const;
export type PendingOfficialSpec = typeof PENDING_OFFICIAL_SPEC;
