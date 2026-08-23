import { describe, expect, it } from "vitest";
import { PLANS, PLAN_ORDER, getPlan, planFromStripePriceId } from "@/src/config/plans";

describe("Configuration des offres", () => {
  it("expose une seule source de vérité cohérente", () => {
    for (const slug of PLAN_ORDER) {
      const plan = PLANS[slug];
      expect(plan.slug).toBe(slug);
      expect(plan.currency).toBe("EUR");
      expect(plan.bullets.length).toBeGreaterThan(0);
    }
  });

  it("met une seule offre en avant", () => {
    const highlighted = PLAN_ORDER.filter((slug) => PLANS[slug].highlighted);
    expect(highlighted).toEqual(["pro"]);
  });

  it("fait croître les quotas avec le prix", () => {
    expect(PLANS.essentiel.limits.invoices_per_month).toBeLessThan(
      PLANS.pro.limits.invoices_per_month,
    );
    expect(PLANS.pro.limits.invoices_per_month).toBeLessThan(
      PLANS.business.limits.invoices_per_month,
    );
    expect(PLANS.enterprise.limits.invoices_per_month).toBe(-1);
  });

  it("réserve l'API aux offres qui la vendent", () => {
    expect(PLANS.essentiel.features).not.toContain("api_access");
    expect(PLANS.pro.features).toContain("api_access");
  });

  it("refuse une offre inconnue", () => {
    expect(() => getPlan("gratuit")).toThrow();
  });

  it("ne rattache aucun price Stripe tant que rien n'est configuré", () => {
    expect(planFromStripePriceId("price_inexistant")).toBeNull();
  });
});
