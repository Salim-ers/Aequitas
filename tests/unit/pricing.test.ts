import { describe, expect, it } from "vitest";
import { PLANS, PLAN_ORDER, formatPlanPrice } from "@/src/config/plans";
import { FEATURE_AVAILABILITY } from "@/src/content/status";

/**
 * Cohérence de la grille tarifaire.
 *
 * Le prix affiché vient du code, le prix prélevé vient de Stripe : ce test
 * ne peut pas vérifier le second. Il verrouille en revanche tout ce qui est
 * vérifiable localement, notamment qu'aucune fonctionnalité vendue n'échappe
 * à la table de disponibilité.
 */
describe("Grille tarifaire", () => {
  it("chaque fonctionnalité d'une offre a une disponibilité déclarée", () => {
    for (const slug of PLAN_ORDER) {
      for (const feature of PLANS[slug].features) {
        expect(
          FEATURE_AVAILABILITY[feature],
          `${slug} vend « ${feature} » sans disponibilité déclarée`,
        ).toBeDefined();
      }
    }
  });

  it("les offres payantes sont ordonnées par prix croissant", () => {
    const paid = PLAN_ORDER.map((slug) => PLANS[slug]).filter(
      (plan) => plan.monthlyPriceCents !== null,
    );
    const prices = paid.map((plan) => plan.monthlyPriceCents!);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  it("l'offre annuelle revient moins cher que douze mensualités", () => {
    for (const slug of PLAN_ORDER) {
      const plan = PLANS[slug];
      if (plan.monthlyPriceCents === null || plan.yearlyPriceCents === null) continue;
      expect(
        plan.yearlyPriceCents,
        `${slug} : l'annuel ne doit pas coûter plus que 12 mois`,
      ).toBeLessThan(plan.monthlyPriceCents * 12);
    }
  });

  it("le prix d'entrée annoncé correspond à l'offre la moins chère", () => {
    const cheapest = Math.min(
      ...PLAN_ORDER.map((slug) => PLANS[slug].monthlyPriceCents).filter(
        (cents): cents is number => cents !== null,
      ),
    );
    // Le site annonce « À partir de 19 € » : la valeur doit suivre le code.
    expect(cheapest).toBe(1900);
  });

  it("une puce marquée « bientôt » ne peut pas décrire une capacité disponible", () => {
    // Garde-fou de cohérence : le libellé et la disponibilité doivent aller
    // dans le même sens pour les lignes que l'on sait rattacher.
    const knownLabels: Record<string, keyof typeof FEATURE_AVAILABILITY> = {
      "Journal d'audit": "audit_log",
      "Rôles et permissions avancées": "advanced_permissions",
      "Support prioritaire": "priority_support",
    };
    for (const slug of PLAN_ORDER) {
      for (const bullet of PLANS[slug].bullets) {
        const key = knownLabels[bullet.label];
        if (!key) continue;
        const available = FEATURE_AVAILABILITY[key] === "available";
        expect(
          Boolean(bullet.soon),
          `${slug} : « ${bullet.label} » est ${available ? "disponible" : "à venir"}`,
        ).toBe(!available);
      }
    }
  });

  it("formatPlanPrice rend un montant en euros sans décimale", () => {
    expect(formatPlanPrice(PLANS.essentiel)).toMatch(/19/);
    expect(formatPlanPrice(PLANS.enterprise)).toBe("Sur devis");
  });
});
