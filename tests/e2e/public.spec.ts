import { expect, test } from "@playwright/test";

/** §64 — Parcours public vérifié sur le Preview Deployment. */

test.describe("Site public", () => {
  test("la landing présente la proposition et les deux appels à l'action", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "La plateforme française",
    );
    await expect(
      page.getByRole("link", { name: "Créer mon compte" }).first(),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Découvrir la plateforme" })).toBeVisible();
  });

  test("l'aperçu de facture affiche des totaux calculés, pas une image", async ({ page }) => {
    await page.goto("/fonctionnalites");
    // Les montants viennent du moteur de TVA : ils doivent être présents dans le
    // DOM. L'assertion est cadrée sur l'aperçu réel : les maquettes marketing
    // affichent elles aussi un « Total TTC », mais fictif.
    await expect(page.getByText("Total TTC")).toBeVisible();
    await expect(page.locator("text=/AEQ-\\d{4}-\\d{6}/")).toBeVisible();
  });

  test("la page tarifs liste les quatre offres et met Pro en avant", async ({ page }) => {
    await page.goto("/tarifs");
    for (const name of ["Essentiel", "Pro", "Business", "Enterprise"]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByText("Recommandé")).toBeVisible();
  });

  test("le disclaimer réglementaire est présent sur toutes les pages publiques", async ({
    page,
  }) => {
    for (const path of ["/", "/tarifs", "/securite", "/conformite"]) {
      await page.goto(path);
      await expect(
        page.getByText(/immatriculation en qualité de Plateforme Agréée/).first(),
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

/**
 * Garde-fous de la refonte : ces trois défauts existaient et sont corrigés.
 * Ils ne doivent pas revenir.
 */
test.describe("Qualité de la refonte", () => {
  const PUBLIC_PATHS = [
    "/",
    "/fonctionnalites",
    "/facturation-electronique",
    "/tarifs",
    "/securite",
    "/demarche-pa",
    "/faq",
    "/integrations",
    "/developers",
    "/contact",
  ];

  test("aucune page publique ne défile horizontalement", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    for (const path of PUBLIC_PATHS) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} déborde de ${overflow}px`).toBeLessThanOrEqual(0);
    }
  });

  test("chaque page publique expose exactement un h1", async ({ page }) => {
    for (const path of PUBLIC_PATHS) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }), path).toHaveCount(1);
    }
  });

  test("la navigation applicative n'expose aucun lien mort", async ({ page }) => {
    // Les modules non construits sont annoncés « Bientôt » et ne sont pas
    // des liens : c'est ce qui remplace les 404 de l'ancienne sidebar.
    await page.goto("/connexion");
    for (const label of ["Factures", "Devis", "Clients", "Paiements"]) {
      await expect(page.getByRole("link", { name: label, exact: true })).toHaveCount(0);
    }
  });
});

/**
 * Vérité produit. Ces assertions protègent des promesses commerciales que
 * le code ne tient pas — c'est le genre de régression qui passe inaperçue
 * en relecture et qui coûte cher dans un domaine réglementé.
 */
test.describe("Promesses produit", () => {
  const FORBIDDEN = [
    /Plateforme Agréée Aequitas/i,
    /agréée? (par l'État|DGFiP)/i,
    /certifiée? par l'État/i,
    /partenaire officiel de l'État/i,
    /tout cela existe et fonctionne/i,
  ];

  test("aucune revendication d'agrément sur les pages publiques", async ({ page }) => {
    for (const path of ["/", "/facturation-electronique", "/tarifs", "/demarche-pa", "/securite"]) {
      await page.goto(path);
      // La page Démarche PA cite ces formulations pour dire qu'elle ne les
      // emploie pas : ce bloc est exclu, le reste de la page ne l'est pas.
      const body = await page.evaluate(() => {
        const clone = document.body.cloneNode(true) as HTMLElement;
        // Next embarque sa charge utile RSC dans des <script> du body :
        // sans ce filtre, le test lirait du payload sérialisé et non le
        // texte réellement affiché.
        clone
          .querySelectorAll("script, style, template, noscript, [data-claims-blocklist]")
          .forEach((n) => n.remove());
        return clone.textContent ?? "";
      });
      for (const pattern of FORBIDDEN) {
        expect(body, `${path} contient « ${pattern} »`).not.toMatch(pattern);
      }
    }
  });

  test("la page démarche PA dit explicitement que le statut n'est pas acquis", async ({
    page,
  }) => {
    await page.goto("/demarche-pa");
    await expect(page.getByText(/n'est pas Plateforme Agréée/i).first()).toBeVisible();
  });

  test("le comparatif distingue disponible et à venir", async ({ page }) => {
    await page.goto("/tarifs");
    // La légende doit exister : sans elle, une horloge se lit comme une coche.
    await expect(page.getByText("Inclus et disponible aujourd'hui")).toBeVisible();
    await expect(page.getByText("Inclus dans l'offre, activation à venir")).toBeVisible();
    // Au moins une fonctionnalité non livrée est marquée comme telle.
    expect(
      await page.getByText("Inclus dans l'offre, pas encore disponible").count(),
    ).toBeGreaterThan(0);
  });

  test("les maquettes marketing sont identifiées comme des aperçus", async ({ page }) => {
    await page.goto("/");
    expect(await page.getByText("Aperçu", { exact: true }).count()).toBeGreaterThan(0);
  });
});

test.describe("Espace plateforme", () => {
  const ADMIN_PATHS = ["/admin", "/admin/organisations", "/admin/journal", "/admin/bac-a-sable"];

  test("aucun écran d'administration n'est atteignable sans session", async ({ page }) => {
    for (const path of ADMIN_PATHS) {
      await page.goto(path);
      await expect(page, path).toHaveURL(/\/(connexion|dashboard|onboarding)/);
    }
  });

  test("l'espace plateforme est exclu de l'indexation", async ({ page, request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");

    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).not.toContain("/admin");
  });
});

test.describe("Espace applicatif", () => {
  test("le dashboard n'est pas accessible sans session", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/(connexion|onboarding)/);
  });

  test("les pages d'authentification s'affichent", async ({ page }) => {
    await page.goto("/inscription");
    await expect(page.getByLabel("Adresse e-mail")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();

    await page.goto("/connexion");
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });
});
