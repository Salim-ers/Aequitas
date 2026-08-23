import { expect, test } from "@playwright/test";

/** §64 — Parcours public vérifié sur le Preview Deployment. */

test.describe("Site public", () => {
  test("la landing présente la proposition et les deux appels à l'action", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "La facturation électronique",
    );
    await expect(page.getByRole("link", { name: "Commencer gratuitement" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Découvrir Aequitas" })).toBeVisible();
  });

  test("le hero affiche des totaux calculés, pas une image", async ({ page }) => {
    await page.goto("/");
    // Les montants viennent du moteur de TVA : ils doivent être présents dans le DOM.
    await expect(page.getByText("Total TTC")).toBeVisible();
    await expect(page.locator("text=/AEQ-\\d{4}-\\d{6}/")).toBeVisible();
  });

  test("la page tarifs liste les quatre offres et met Pro en avant", async ({ page }) => {
    await page.goto("/tarifs");
    for (const name of ["Essentiel", "Pro", "Business", "Enterprise"]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByText("Le plus populaire")).toBeVisible();
  });

  test("le disclaimer Plateforme Agréée est présent sur toutes les pages publiques", async ({
    page,
  }) => {
    for (const path of ["/", "/tarifs", "/securite", "/conformite"]) {
      await page.goto(path);
      await expect(
        page.getByText(/n'est pas actuellement présentée comme Plateforme Agréée/),
      ).toBeVisible();
    }
  });

  test("aucune revendication de certification non détenue", async ({ page }) => {
    await page.goto("/securite");
    const body = (await page.textContent("body")) ?? "";
    expect(body).not.toContain("ISO 27001 certified");
    expect(body).not.toContain("SecNumCloud");
  });

  test("les en-têtes de sécurité sont bien envoyés", async ({ page }) => {
    const response = await page.goto("/");
    const headers = response?.headers() ?? {};
    expect(headers["strict-transport-security"]).toBeTruthy();
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
  });

  test("la sonde de santé répond", async ({ request }) => {
    const response = await request.get("/api/health");
    const body = (await response.json()) as { database: boolean; stripe: boolean };
    expect(typeof body.database).toBe("boolean");
    expect(typeof body.stripe).toBe("boolean");
  });
});

test.describe("Espace applicatif", () => {
  test("le dashboard n'est pas accessible sans session", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/(connexion|onboarding)/);
  });

  test("les pages d'authentification s'affichent", async ({ page }) => {
    await page.goto("/inscription");
    await expect(page.getByLabel("Adresse email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();

    await page.goto("/connexion");
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });
});
