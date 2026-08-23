import { describe, expect, it } from "vitest";
import { Money, formatMoney } from "@/src/lib/money";

describe("Money", () => {
  it("ne reproduit pas l'erreur du flottant", () => {
    // Le cas canonique : 0.1 + 0.2 doit valoir exactement 0.30.
    expect(Money.from("0.1").add("0.2").toString()).toBe("0.30");
    expect(0.1 + 0.2).not.toBe(0.3);
  });

  it("stocke sur 4 décimales et affiche sur 2", () => {
    const value = Money.from("1234.56789");
    expect(value.toDb()).toBe("1234.5679");
    expect(value.toString()).toBe("1234.57");
  });

  it("arrondit au centime supérieur à la moitié", () => {
    expect(Money.from("0.125").round().toString()).toBe("0.13");
    expect(Money.from("2.005").round().toString()).toBe("2.01");
  });

  it("additionne 1000 centimes sans dérive", () => {
    const total = Money.sum(Array.from({ length: 1000 }, () => "0.01"));
    expect(total.toString()).toBe("10.00");
  });

  it("relit une colonne numeric sans perte", () => {
    expect(Money.fromDb("9360.0000").toString()).toBe("9360.00");
    expect(Money.fromDb(null).isZero()).toBe(true);
  });

  it("accepte la virgule décimale et les espaces de saisie", () => {
    expect(Money.from("1 234,50").toString()).toBe("1234.50");
  });

  it("refuse la division par zéro", () => {
    expect(() => Money.from("10").div(0)).toThrow(RangeError);
  });

  it("formate en euros français", () => {
    expect(formatMoney("1234.5").replace(/\u202f|\u00a0/g, " ")).toBe("1 234,50 €");
  });
});
