import { describe, expect, it } from "vitest";
import {
  computeBalanceDue,
  computeDocumentTotals,
  getTaxRate,
  UnknownTaxRateError,
} from "@/src/tax/tax-engine";

const line = (
  quantity: string,
  unitPriceHT: string,
  taxRateId: string,
  discountPercent = "0",
) => ({ quantity, unitPriceHT, taxRateId, discountPercent });

describe("TaxEngine", () => {
  it("calcule HT, TVA et TTC sur un taux unique", () => {
    const totals = computeDocumentTotals([line("3", "100.00", "fr-standard-20")]);
    expect(totals.totalHT.toString()).toBe("300.00");
    expect(totals.totalTax.toString()).toBe("60.00");
    expect(totals.totalTTC.toString()).toBe("360.00");
  });

  it("applique une remise de ligne avant la TVA", () => {
    const totals = computeDocumentTotals([line("1", "1000.00", "fr-standard-20", "10")]);
    expect(totals.totalHT.toString()).toBe("900.00");
    expect(totals.totalTax.toString()).toBe("180.00");
    expect(totals.lineDiscountTotal.toString()).toBe("100.00");
  });

  it("ventile la TVA par taux sans les mélanger", () => {
    const totals = computeDocumentTotals([
      line("1", "100.00", "fr-standard-20"),
      line("1", "100.00", "fr-intermediate-10"),
      line("1", "100.00", "fr-reduced-5-5"),
    ]);
    expect(totals.vatBreakdown).toHaveLength(3);
    expect(totals.totalHT.toString()).toBe("300.00");
    expect(totals.totalTax.toString()).toBe("35.50");
    expect(totals.totalTTC.toString()).toBe("335.50");
  });

  it("répartit la remise globale au prorata et conserve l'égalité des totaux", () => {
    const totals = computeDocumentTotals(
      [line("1", "333.33", "fr-standard-20"), line("1", "666.67", "fr-intermediate-10")],
      "7",
    );
    // La somme des bases ventilées doit égaler le total HT, au centime près.
    const sumBases = totals.vatBreakdown.reduce(
      (acc, entry) => acc.add(entry.baseHT),
      totals.vatBreakdown[0]!.baseHT.sub(totals.vatBreakdown[0]!.baseHT),
    );
    expect(sumBases.toString()).toBe(totals.totalHT.toString());

    const sumTax = totals.vatBreakdown.reduce(
      (acc, entry) => acc.add(entry.taxAmount),
      totals.vatBreakdown[0]!.taxAmount.sub(totals.vatBreakdown[0]!.taxAmount),
    );
    expect(sumTax.toString()).toBe(totals.totalTax.toString());
    expect(totals.totalHT.add(totals.totalTax).toString()).toBe(totals.totalTTC.toString());
  });

  it("porte la mention légale d'une exonération", () => {
    const totals = computeDocumentTotals([line("1", "500.00", "fr-exempt-293b")]);
    expect(totals.totalTax.toString()).toBe("0.00");
    expect(totals.vatBreakdown[0]?.legalMention).toContain("293 B");
  });

  it("gère l'autoliquidation à taux zéro", () => {
    const totals = computeDocumentTotals([line("1", "2000.00", "fr-reverse-charge")]);
    expect(totals.totalTTC.toString()).toBe("2000.00");
    expect(totals.vatBreakdown[0]?.categoryCode).toBe("AE");
  });

  it("refuse un taux inconnu plutôt que d'en inventer un", () => {
    expect(() => getTaxRate("fr-taux-imaginaire")).toThrow(UnknownTaxRateError);
  });

  it("calcule le reste à payer après règlements partiels", () => {
    const totals = computeDocumentTotals([line("10", "780.00", "fr-standard-20")]);
    expect(totals.totalTTC.toString()).toBe("9360.00");
    expect(computeBalanceDue(totals.totalTTC, ["3000.00", "2500.50"]).toString()).toBe(
      "3859.50",
    );
  });

  it("produit un avoir cohérent en inversant les quantités", () => {
    const invoice = computeDocumentTotals([line("4", "250.00", "fr-standard-20")]);
    const creditNote = computeDocumentTotals([line("-4", "250.00", "fr-standard-20")]);
    expect(creditNote.totalTTC.toString()).toBe(`-${invoice.totalTTC.toString()}`);
  });
});
