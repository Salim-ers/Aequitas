/**
 * §85 — Modèle canonique.
 * Sert de pivot entre l'interface utilisateur et les formats Factur-X / UBL / CII.
 * Les noms de champs sont proches de la sémantique EN 16931 sans en constituer
 * une implémentation : le mapping normatif est traité dans les adaptateurs.
 */

export interface CanonicalParty {
  legalName: string;
  tradeName?: string | null;
  legalForm?: string | null;
  siren?: string | null;
  siret?: string | null;
  vatNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  countryCode: string;
  email?: string | null;
  phone?: string | null;
}

export interface CanonicalLine {
  position: number;
  description: string;
  unit: string;
  quantity: string;
  unitPriceHT: string;
  discountPercent: string;
  taxRateId: string;
  taxCategoryCode: string;
  taxRatePercent: string;
  netHT: string;
  taxAmount: string;
  totalTTC: string;
}

export interface CanonicalVatBreakdownEntry {
  taxCategoryCode: string;
  taxRatePercent: string;
  baseHT: string;
  taxAmount: string;
  exemptionReason?: string | null;
}

export interface CanonicalPaymentTerms {
  dueDate: string | null;
  paymentTermsText?: string | null;
  iban?: string | null;
  bic?: string | null;
}

export type CanonicalDocumentType = "INVOICE" | "CREDIT_NOTE";

export interface CanonicalInvoice {
  /** Identifiant interne Aequitas, distinct du numéro affiché. */
  internalId: string;
  documentType: CanonicalDocumentType;
  number: string;
  issueDate: string;
  supplyDate?: string | null;
  currency: string;
  seller: CanonicalParty;
  buyer: CanonicalParty;
  lines: CanonicalLine[];
  totalHT: string;
  totalTax: string;
  totalTTC: string;
  amountPaid: string;
  balanceDue: string;
  vatBreakdown: CanonicalVatBreakdownEntry[];
  paymentTerms: CanonicalPaymentTerms;
  purchaseOrderRef?: string | null;
  /** Référence de la facture rectifiée, obligatoire pour un avoir. */
  correctedInvoiceNumber?: string | null;
  notes?: string | null;
  legalMentions: string[];
}
