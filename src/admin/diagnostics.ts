import "server-only";
import { isDatabaseConfigured, isStripeConfigured, isDemoSeedEnabled, baseUrl } from "@/src/lib/env";
import { isRegulatorySimulationActive } from "@/src/regulatory/registry";
import { PLAN_ORDER, PLANS } from "@/src/config/plans";

/**
 * État de configuration de l'instance.
 *
 * §67 — Aucune valeur de variable d'environnement n'est renvoyée : seulement
 * sa présence. Un écran d'administration ne doit jamais devenir un moyen
 * commode de lire les secrets du déploiement.
 */

export type CheckLevel = "ok" | "warn" | "off";

export interface Check {
  label: string;
  level: CheckLevel;
  detail: string;
}

export interface CheckGroup {
  title: string;
  checks: Check[];
}

function present(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export function collectDiagnostics(): CheckGroup[] {
  const stripePrices = PLAN_ORDER.filter((slug) => PLANS[slug].monthlyPriceCents !== null);
  const missingPrices = stripePrices.filter((slug) => !PLANS[slug].stripePriceIdMonthly);

  return [
    {
      title: "Socle",
      checks: [
        {
          label: "Base de données",
          level: isDatabaseConfigured() ? "ok" : "warn",
          detail: isDatabaseConfigured()
            ? "DATABASE_URL est renseignée."
            : "DATABASE_URL absente : l'espace applicatif ne peut pas fonctionner.",
        },
        {
          label: "Secret d'authentification",
          level: present("AUTH_SECRET") || present("BETTER_AUTH_SECRET") ? "ok" : "warn",
          detail:
            present("AUTH_SECRET") || present("BETTER_AUTH_SECRET")
              ? "Le secret de session est défini."
              : "AUTH_SECRET absente : aucune session ne peut être signée.",
        },
        {
          label: "URL publique",
          level: "ok",
          detail: `Les liens sortants sont construits sur ${baseUrl()}.`,
        },
      ],
    },
    {
      title: "Facturation",
      checks: [
        {
          label: "Clés Stripe",
          level: isStripeConfigured() ? "ok" : "off",
          detail: isStripeConfigured()
            ? "Clé secrète et secret de webhook présents."
            : "Stripe non configuré : souscription et portail sont indisponibles.",
        },
        {
          label: "Cohérence des prix",
          level: isStripeConfigured() ? "warn" : "off",
          detail:
            "Les montants affichés viennent du code ; les montants prélevés viennent des tarifs Stripe. Après toute modification de prix, vérifiez que les deux concordent.",
        },
        {
          label: "Tarifs Stripe",
          level: missingPrices.length === 0 ? "ok" : "warn",
          detail:
            missingPrices.length === 0
              ? "Chaque offre payante a son identifiant de tarif mensuel."
              : `Tarif mensuel manquant pour : ${missingPrices
                  .map((slug) => PLANS[slug].name)
                  .join(", ")}.`,
        },
      ],
    },
    {
      title: "Réglementaire",
      checks: [
        {
          label: "Canal de transmission",
          level: isRegulatorySimulationActive() ? "off" : "ok",
          detail: isRegulatorySimulationActive()
            ? "Simulateur actif : aucune facture n'est réellement transmise."
            : "Un adaptateur réel est branché.",
        },
      ],
    },
    {
      title: "Test",
      checks: [
        {
          label: "Bac à sable",
          level: isDemoSeedEnabled() ? "ok" : "off",
          detail: isDemoSeedEnabled()
            ? "DEMO_SEED_ENABLED=true : génération et purge autorisées."
            : "Désactivé. Il l'est systématiquement lorsque VERCEL_ENV vaut « production ».",
        },
      ],
    },
  ];
}
