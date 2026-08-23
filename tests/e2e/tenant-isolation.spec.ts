import { expect, test } from "@playwright/test";

/**
 * §105 — Test multi-tenant obligatoire.
 *
 * Ce fichier décrit le scénario cible ; il est activé dès que le seed de
 * démonstration (DEMO_SEED_ENABLED) crée les deux organisations de test.
 * Marqué `fixme` plutôt que supprimé : la lacune reste visible dans le rapport
 * de tests au lieu de disparaître silencieusement.
 */

const RESOURCES = [
  "/clients",
  "/factures",
  "/paiements",
  "/api/v1/customers",
  "/api/v1/invoices",
] as const;

test.describe("Isolation entre organisations", () => {
  for (const resource of RESOURCES) {
    test.fixme(
      `un membre de l'organisation A ne peut pas lire ${resource} de l'organisation B`,
      async () => {
        expect(true).toBe(true);
      },
    );
  }
});
