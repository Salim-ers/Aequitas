import type {
  CentralDirectoryGateway,
  ElectronicInvoiceGateway,
  TaxReportingGateway,
} from "./ports";
import {
  SimulatorDirectoryGateway,
  SimulatorElectronicInvoiceGateway,
  SimulatorTaxReportingGateway,
} from "./adapters/simulator";

/**
 * Sélection de l'implémentation active.
 * Tant qu'aucun canal officiel n'est raccordé, seuls les simulateurs existent :
 * ajouter un adaptateur réel ici, jamais dans le code applicatif.
 */

export function getElectronicInvoiceGateway(): ElectronicInvoiceGateway {
  return new SimulatorElectronicInvoiceGateway();
}

export function getDirectoryGateway(): CentralDirectoryGateway {
  return new SimulatorDirectoryGateway();
}

export function getTaxReportingGateway(): TaxReportingGateway {
  return new SimulatorTaxReportingGateway();
}

/** Affiché dans l'interface partout où un statut réglementaire apparaît (§76). */
export function isRegulatorySimulationActive(): boolean {
  return getElectronicInvoiceGateway().simulated;
}
