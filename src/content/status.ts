import type { FeatureKey } from "@/src/config/plans";

/**
 * État réel du produit — source de vérité unique.
 *
 * Cette table décide de ce que la page Tarifs annonce comme inclus, et de ce
 * que la page Démarche PA affiche comme disponible. Les deux lisent d'ici,
 * donc elles ne peuvent pas se contredire.
 *
 * RÈGLE : une valeur `available` signifie qu'un utilisateur peut s'en servir
 * aujourd'hui, pas qu'une table existe en base ni qu'un port est défini.
 * Vendre une fonctionnalité absente est un mensonge commercial ; l'écrire ici
 * par optimisme revient au même.
 *
 * Vérifié le 23 août 2026 contre le code : aucune route API v1, aucun webhook
 * sortant, aucune action serveur métier (devis, factures, clients) n'existe
 * encore. Les adaptateurs réglementaires ne sont que des simulateurs.
 */

export type Availability = "available" | "soon";

export const FEATURE_AVAILABILITY: Readonly<Record<FeatureKey, Availability>> = {
  // Le socle métier existe en base et le moteur de TVA fonctionne, mais aucun
  // écran ne permet encore de créer ces documents.
  quotes: "soon",
  invoices: "soon",
  credit_notes: "soon",
  suppliers: "soon",
  exports: "soon",
  recurring_invoices: "soon",
  automated_reminders: "soon",
  supplier_import: "soon",
  accounting_export: "soon",
  advanced_reporting: "soon",

  // Adaptateurs réglementaires : seuls les simulateurs sont branchés.
  factur_x: "soon",
  e_reporting: "soon",

  // Aucune route /api/v1, aucune livraison de webhook sortant.
  api_access: "soon",
  webhooks: "soon",
  sso: "soon",

  // Réellement en place et vérifiable dans le code.
  audit_log: "available", // src/audit/audit-log.ts, consultable dans /admin
  advanced_permissions: "available", // src/permissions/roles.ts, vérifié serveur
  priority_support: "available", // engagement de service, pas de code requis
};

export function isAvailable(feature: FeatureKey): boolean {
  return FEATURE_AVAILABILITY[feature] === "available";
}

/** Étapes affichées sur la page Démarche PA. */
export interface PlatformStatus {
  readonly label: string;
  readonly state: Availability | "in-progress";
  readonly detail: string;
}

export const PLATFORM_STATUS: readonly PlatformStatus[] = [
  {
    label: "Socle applicatif",
    state: "available",
    detail:
      "Comptes, organisations, rôles vérifiés côté serveur, isolation des données et journal d'audit.",
  },
  {
    label: "Moteur de facturation",
    state: "available",
    detail:
      "Calcul de TVA multi-taux, arithmétique monétaire exacte et numérotation séquentielle, couverts par des tests.",
  },
  {
    label: "Abonnements",
    state: "available",
    detail: "Souscription, portail de facturation et gestion des quotas.",
  },
  {
    label: "Écrans de gestion",
    state: "in-progress",
    detail:
      "Devis, factures, clients et règlements : le modèle de données et les calculs existent, les écrans de saisie sont en cours.",
  },
  {
    label: "Formats électroniques",
    state: "in-progress",
    detail:
      "Modèle de facture unique en place. Les rendus Factur-X, UBL et CII sont en développement.",
  },
  {
    label: "Interopérabilité",
    state: "soon",
    detail:
      "Seuls des adaptateurs de simulation sont branchés. Aucun canal officiel n'est raccordé.",
  },
  {
    label: "Tests réglementaires",
    state: "soon",
    detail: "Ils dépendent du raccordement aux canaux officiels.",
  },
  {
    label: "Immatriculation Plateforme Agréée",
    state: "soon",
    detail:
      "Démarche en préparation. Le statut ne sera affiché qu'après avoir été délivré.",
  },
];
