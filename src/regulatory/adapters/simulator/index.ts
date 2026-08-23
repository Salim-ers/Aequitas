import { createHash, randomUUID } from "node:crypto";
import type { CanonicalInvoice } from "@/src/domain/canonical-invoice";
import type {
  CentralDirectoryGateway,
  DirectoryLookupResult,
  ElectronicInvoiceGateway,
  ReportingSubmission,
  TaxReportingGateway,
  TransmissionResult,
} from "../../ports";

/**
 * §76 — Simulateurs.
 * Ces implémentations n'échangent avec aucun système officiel.
 * Toute sortie porte `simulated: true` et l'interface doit l'afficher.
 */

const SIMULATION_NOTICE =
  "Environnement de simulation — aucun échange avec un système officiel";

export class SimulatorElectronicInvoiceGateway implements ElectronicInvoiceGateway {
  readonly name = "simulator";
  readonly simulated = true;

  async transmit(
    invoice: CanonicalInvoice,
    options: { idempotencyKey: string },
  ): Promise<TransmissionResult> {
    // La référence est déterministe : rejouer la même clé ne crée pas un doublon (§89).
    const reference = `SIM-${createHash("sha256")
      .update(`${invoice.internalId}:${options.idempotencyKey}`)
      .digest("hex")
      .slice(0, 16)
      .toUpperCase()}`;

    return {
      reference,
      status: "SIMULATED",
      simulated: true,
      occurredAt: new Date().toISOString(),
      message: SIMULATION_NOTICE,
    };
  }

  async fetchLifecycle(reference: string): Promise<TransmissionResult[]> {
    return [
      {
        reference,
        status: "SIMULATED",
        simulated: true,
        occurredAt: new Date().toISOString(),
        message: SIMULATION_NOTICE,
      },
    ];
  }
}

export class SimulatorDirectoryGateway implements CentralDirectoryGateway {
  readonly name = "simulator";
  readonly simulated = true;

  async lookupBySiret(siret: string): Promise<DirectoryLookupResult> {
    return {
      found: false,
      routingIdentifier: null,
      simulated: true,
      source: `simulator:${siret.slice(0, 3)}***`,
    };
  }

  async lookupByVatNumber(vatNumber: string): Promise<DirectoryLookupResult> {
    return {
      found: false,
      routingIdentifier: null,
      simulated: true,
      source: `simulator:${vatNumber.slice(0, 4)}***`,
    };
  }
}

export class SimulatorTaxReportingGateway implements TaxReportingGateway {
  readonly name = "simulator";
  readonly simulated = true;

  async submit(
    submission: ReportingSubmission,
    _options: { idempotencyKey: string },
  ): Promise<TransmissionResult> {
    void _options;
    return {
      reference: `SIM-REPORT-${submission.period}-${randomUUID().slice(0, 8).toUpperCase()}`,
      status: "SIMULATED",
      simulated: true,
      occurredAt: new Date().toISOString(),
      message: SIMULATION_NOTICE,
    };
  }
}
