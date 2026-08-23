import type { CanonicalInvoice } from "@/src/domain/canonical-invoice";

/**
 * §75 / §77 / §123 — Ports réglementaires.
 *
 * Le frontend ne dépend jamais d'une implémentation : uniquement de ces
 * interfaces. Le jour où le cœur réglementaire est déplacé sur une
 * infrastructure qualifiée, seuls les adaptateurs changent.
 */

export interface TransmissionResult {
  /** Identifiant fourni par le canal, ou identifiant de simulation. */
  reference: string;
  status: "QUEUED" | "SIMULATED" | "SENT" | "ACKNOWLEDGED" | "REJECTED" | "FAILED";
  /** §76 — vrai tant que l'échange n'a pas lieu avec un canal officiel. */
  simulated: boolean;
  occurredAt: string;
  message?: string;
}

export interface DirectoryLookupResult {
  found: boolean;
  routingIdentifier: string | null;
  simulated: boolean;
  source: string;
}

export interface ReportingSubmission {
  kind: "E_REPORTING_TRANSACTION" | "E_REPORTING_PAYMENT";
  period: string;
  payload: Record<string, unknown>;
}

export interface ElectronicInvoiceGateway {
  readonly name: string;
  readonly simulated: boolean;
  transmit(
    invoice: CanonicalInvoice,
    options: { idempotencyKey: string },
  ): Promise<TransmissionResult>;
  fetchLifecycle(reference: string): Promise<TransmissionResult[]>;
}

export interface CentralDirectoryGateway {
  readonly name: string;
  readonly simulated: boolean;
  lookupBySiret(siret: string): Promise<DirectoryLookupResult>;
  lookupByVatNumber(vatNumber: string): Promise<DirectoryLookupResult>;
}

export interface TaxReportingGateway {
  readonly name: string;
  readonly simulated: boolean;
  submit(
    submission: ReportingSubmission,
    options: { idempotencyKey: string },
  ): Promise<TransmissionResult>;
}

export interface PartnerPlatformGateway {
  readonly name: string;
  readonly simulated: boolean;
  route(
    invoice: CanonicalInvoice,
    destinationIdentifier: string,
    options: { idempotencyKey: string },
  ): Promise<TransmissionResult>;
}

export interface PublicSectorGateway {
  readonly name: string;
  readonly simulated: boolean;
  submit(
    invoice: CanonicalInvoice,
    options: { idempotencyKey: string },
  ): Promise<TransmissionResult>;
}

/** Adaptateurs de format, tous alimentés par CanonicalInvoice (§32). */
export interface FormatAdapter {
  readonly format: "FACTUR_X" | "UBL" | "CII";
  readonly profile: string;
  /** Renvoie le document sérialisé, ou lève RegulatoryConfigurationError. */
  render(invoice: CanonicalInvoice): Promise<{ content: string; contentType: string }>;
  validate(invoice: CanonicalInvoice): Promise<{ valid: boolean; issues: string[] }>;
}
