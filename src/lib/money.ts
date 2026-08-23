import Decimal from "decimal.js";

/**
 * §83 — Abstraction monétaire.
 * Aucun calcul financier ne doit passer par `number`.
 * Stockage PostgreSQL : numeric(19,4). Sérialisation : string.
 */

// 28 chiffres significatifs, arrondi commercial (moitié supérieure).
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export type MoneyInput = string | number | Decimal | Money;

const SCALE = 4; // échelle de stockage
const DISPLAY_SCALE = 2; // échelle d'affichage / de restitution fiscale

export class Money {
  private readonly value: Decimal;

  private constructor(value: Decimal) {
    this.value = value;
  }

  static from(input: MoneyInput): Money {
    if (input instanceof Money) return input;
    if (input instanceof Decimal) return new Money(input);
    if (typeof input === "number") {
      // Toléré uniquement pour des littéraux sûrs (0, 1…). Jamais pour un montant saisi.
      if (!Number.isFinite(input)) {
        throw new TypeError("Money.from: nombre non fini");
      }
      return new Money(new Decimal(input.toString()));
    }
    const normalized = input.trim().replace(/\s/g, "").replace(",", ".");
    if (normalized === "") return Money.zero();
    return new Money(new Decimal(normalized));
  }

  static zero(): Money {
    return new Money(new Decimal(0));
  }

  /** Lecture d'une colonne numeric() renvoyée par le driver sous forme de string. */
  static fromDb(value: string | null | undefined): Money {
    return value == null ? Money.zero() : Money.from(value);
  }

  add(other: MoneyInput): Money {
    return new Money(this.value.plus(Money.from(other).value));
  }

  sub(other: MoneyInput): Money {
    return new Money(this.value.minus(Money.from(other).value));
  }

  /** Multiplication par un scalaire (quantité, taux…), pas par un montant. */
  mul(factor: string | number | Decimal): Money {
    return new Money(this.value.times(new Decimal(factor.toString())));
  }

  div(divisor: string | number | Decimal): Money {
    const d = new Decimal(divisor.toString());
    if (d.isZero()) throw new RangeError("Money.div: division par zéro");
    return new Money(this.value.dividedBy(d));
  }

  negate(): Money {
    return new Money(this.value.negated());
  }

  abs(): Money {
    return new Money(this.value.abs());
  }

  /** Arrondi fiscal au centime (half-up). */
  round(scale: number = DISPLAY_SCALE): Money {
    return new Money(this.value.toDecimalPlaces(scale, Decimal.ROUND_HALF_UP));
  }

  isZero(): boolean {
    return this.value.isZero();
  }

  isNegative(): boolean {
    return this.value.isNegative();
  }

  gt(other: MoneyInput): boolean {
    return this.value.greaterThan(Money.from(other).value);
  }

  gte(other: MoneyInput): boolean {
    return this.value.greaterThanOrEqualTo(Money.from(other).value);
  }

  lt(other: MoneyInput): boolean {
    return this.value.lessThan(Money.from(other).value);
  }

  eq(other: MoneyInput): boolean {
    return this.value.equals(Money.from(other).value);
  }

  /** Valeur destinée à une colonne numeric(19,4). */
  toDb(): string {
    return this.value.toDecimalPlaces(SCALE, Decimal.ROUND_HALF_UP).toFixed(SCALE);
  }

  toString(): string {
    return this.round().toFixed(DISPLAY_SCALE);
  }

  toFixed(scale: number = DISPLAY_SCALE): string {
    return this.value.toDecimalPlaces(scale, Decimal.ROUND_HALF_UP).toFixed(scale);
  }

  /**
   * Conversion en number : affichage et graphiques uniquement.
   * Interdit dans une chaîne de calcul fiscale.
   */
  toDisplayNumber(): number {
    return this.value.toDecimalPlaces(DISPLAY_SCALE, Decimal.ROUND_HALF_UP).toNumber();
  }

  static sum(values: readonly MoneyInput[]): Money {
    return values.reduce<Money>((acc, v) => acc.add(v), Money.zero());
  }
}

export function formatMoney(
  amount: MoneyInput,
  currency: string = "EUR",
  locale: string = "fr-FR",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Money.from(amount).toDisplayNumber());
}
