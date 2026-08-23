import { Money, type MoneyInput } from "@/src/lib/money";

/**
 * §84 — Moteur de TVA central et versionné.
 * Aucun `montant * 0.20` ailleurs dans l'application.
 */

export type TaxCategoryCode =
  | "S" // taux standard
  | "AA" // taux réduit
  | "Z" // taux zéro
  | "E" // exonéré
  | "AE" // autoliquidation
  | "K" // livraison intracommunautaire
  | "G"; // export hors UE

export interface TaxRate {
  /** Identifiant stable, référencé en base. Ne jamais réutiliser après retrait. */
  readonly id: string;
  readonly label: string;
  /** Taux en pourcentage, exprimé en chaîne décimale. "20" = 20 %. */
  readonly rate: string;
  readonly categoryCode: TaxCategoryCode;
  /** Mention légale obligatoire lorsque le taux n'est pas un taux de droit commun. */
  readonly legalMention?: string;
  readonly validFrom: string; // ISO date
  readonly validUntil?: string;
}

/**
 * Taux métropole. Les taux DOM/COM et les régimes particuliers ne sont pas
 * inclus tant qu'ils n'ont pas été validés : ajouter une version datée plutôt
 * que modifier une entrée existante.
 */
export const TAX_RATES_FR: readonly TaxRate[] = [
  { id: "fr-standard-20", label: "TVA 20 %", rate: "20", categoryCode: "S", validFrom: "2014-01-01" },
  { id: "fr-intermediate-10", label: "TVA 10 %", rate: "10", categoryCode: "AA", validFrom: "2014-01-01" },
  { id: "fr-reduced-5-5", label: "TVA 5,5 %", rate: "5.5", categoryCode: "AA", validFrom: "2014-01-01" },
  { id: "fr-super-reduced-2-1", label: "TVA 2,1 %", rate: "2.1", categoryCode: "AA", validFrom: "2014-01-01" },
  {
    id: "fr-exempt-293b",
    label: "Franchise en base",
    rate: "0",
    categoryCode: "E",
    legalMention: "TVA non applicable, article 293 B du CGI",
    validFrom: "2014-01-01",
  },
  {
    id: "fr-reverse-charge",
    label: "Autoliquidation",
    rate: "0",
    categoryCode: "AE",
    legalMention: "Autoliquidation par le preneur",
    validFrom: "2014-01-01",
  },
  {
    id: "eu-intracom",
    label: "Livraison intracommunautaire",
    rate: "0",
    categoryCode: "K",
    legalMention: "Exonération TVA, article 262 ter I du CGI",
    validFrom: "2014-01-01",
  },
  {
    id: "export-outside-eu",
    label: "Exportation hors UE",
    rate: "0",
    categoryCode: "G",
    legalMention: "Exonération TVA, article 262 I du CGI",
    validFrom: "2014-01-01",
  },
] as const;

export function getTaxRate(id: string): TaxRate {
  const found = TAX_RATES_FR.find((r) => r.id === id);
  if (!found) throw new UnknownTaxRateError(id);
  return found;
}

export class UnknownTaxRateError extends Error {
  constructor(id: string) {
    super(`Taux de TVA inconnu : ${id}`);
    this.name = "UnknownTaxRateError";
  }
}

export interface TaxableLine {
  readonly quantity: string;
  readonly unitPriceHT: string;
  /** Remise en pourcentage sur la ligne ("10" = 10 %). */
  readonly discountPercent?: string;
  readonly taxRateId: string;
}

export interface ComputedLine {
  readonly grossHT: Money;
  readonly discount: Money;
  readonly netHT: Money;
  readonly taxAmount: Money;
  readonly totalTTC: Money;
  readonly taxRateId: string;
}

export interface VatBreakdownEntry {
  readonly taxRateId: string;
  readonly label: string;
  readonly rate: string;
  readonly categoryCode: TaxCategoryCode;
  readonly baseHT: Money;
  readonly taxAmount: Money;
  readonly legalMention?: string;
}

export interface DocumentTotals {
  readonly lines: readonly ComputedLine[];
  readonly subtotalHT: Money;
  readonly lineDiscountTotal: Money;
  readonly globalDiscount: Money;
  readonly totalHT: Money;
  readonly totalTax: Money;
  readonly totalTTC: Money;
  readonly vatBreakdown: readonly VatBreakdownEntry[];
}

function computeLine(line: TaxableLine): ComputedLine {
  const rate = getTaxRate(line.taxRateId);
  const gross = Money.from(line.unitPriceHT).mul(line.quantity);
  const discount =
    line.discountPercent && line.discountPercent !== "0"
      ? gross.mul(line.discountPercent).div(100)
      : Money.zero();
  const net = gross.sub(discount).round();
  const tax = net.mul(rate.rate).div(100).round();
  return {
    grossHT: gross.round(),
    discount: discount.round(),
    netHT: net,
    taxAmount: tax,
    totalTTC: net.add(tax),
    taxRateId: line.taxRateId,
  };
}

/**
 * Calcule les totaux d'un document.
 * La TVA est calculée par taux sur la base agrégée, jamais ligne à ligne
 * puis sommée : cela évite les écarts d'arrondi cumulés.
 *
 * @param globalDiscountPercent remise pied de facture, répartie au prorata
 *        des bases par taux.
 */
export function computeDocumentTotals(
  lines: readonly TaxableLine[],
  globalDiscountPercent: string = "0",
): DocumentTotals {
  const computed = lines.map(computeLine);
  const subtotalGross = Money.sum(computed.map((l) => l.grossHT));
  const lineDiscountTotal = Money.sum(computed.map((l) => l.discount));
  const netAfterLineDiscounts = Money.sum(computed.map((l) => l.netHT));

  const globalDiscount =
    globalDiscountPercent && globalDiscountPercent !== "0"
      ? netAfterLineDiscounts.mul(globalDiscountPercent).div(100).round()
      : Money.zero();

  // Base HT par taux, après application prorata de la remise globale.
  const basesByRate = new Map<string, Money>();
  for (const line of computed) {
    const current = basesByRate.get(line.taxRateId) ?? Money.zero();
    basesByRate.set(line.taxRateId, current.add(line.netHT));
  }

  const vatBreakdown: VatBreakdownEntry[] = [];
  let totalHT = Money.zero();
  let totalTax = Money.zero();

  const rateIds = [...basesByRate.keys()];
  rateIds.forEach((rateId, index) => {
    const rawBase = basesByRate.get(rateId) ?? Money.zero();
    let allocatedDiscount: Money;
    if (globalDiscount.isZero() || netAfterLineDiscounts.isZero()) {
      allocatedDiscount = Money.zero();
    } else if (index === rateIds.length - 1) {
      // La dernière tranche absorbe l'écart d'arrondi de la répartition.
      const already = Money.sum(
        rateIds.slice(0, -1).map((id) => {
          const b = basesByRate.get(id) ?? Money.zero();
          return b.div(netAfterLineDiscounts.toDb()).mul(globalDiscount.toDb()).round();
        }),
      );
      allocatedDiscount = globalDiscount.sub(already);
    } else {
      allocatedDiscount = rawBase
        .div(netAfterLineDiscounts.toDb())
        .mul(globalDiscount.toDb())
        .round();
    }

    const base = rawBase.sub(allocatedDiscount).round();
    const rate = getTaxRate(rateId);
    const taxAmount = base.mul(rate.rate).div(100).round();

    totalHT = totalHT.add(base);
    totalTax = totalTax.add(taxAmount);

    vatBreakdown.push({
      taxRateId: rateId,
      label: rate.label,
      rate: rate.rate,
      categoryCode: rate.categoryCode,
      baseHT: base,
      taxAmount,
      ...(rate.legalMention ? { legalMention: rate.legalMention } : {}),
    });
  });

  return {
    lines: computed,
    subtotalHT: subtotalGross,
    lineDiscountTotal,
    globalDiscount,
    totalHT,
    totalTax,
    totalTTC: totalHT.add(totalTax),
    vatBreakdown,
  };
}

/** Reste dû = total TTC - somme des affectations de paiement. */
export function computeBalanceDue(totalTTC: MoneyInput, paid: readonly MoneyInput[]): Money {
  return Money.from(totalTTC).sub(Money.sum(paid)).round();
}
