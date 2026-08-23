/**
 * Calendrier de la réforme.
 *
 * Source unique : la home et la page dédiée lisent le même contenu, pour
 * qu'une correction de date ne puisse pas n'être appliquée qu'à moitié.
 * Ce fichier est prévu pour être modifié seul si la réglementation évolue :
 * aucune date n'est écrite en dur ailleurs.
 *
 * Les formulations renvoient au calendrier réglementaire applicable, parce
 * qu'il relève de l'administration : Aequitas le rapporte, ne le garantit pas.
 */

export interface ReformEntry {
  readonly who: string;
  readonly what: string;
}

export interface ReformMilestone {
  readonly date: string;
  readonly entries: readonly ReformEntry[];
}

export const REFORM_TIMELINE: readonly ReformMilestone[] = [
  {
    date: "1ᵉʳ septembre 2026",
    entries: [
      {
        who: "Toutes les entreprises",
        what: "Doivent être en mesure de recevoir des factures électroniques, quelle que soit leur taille.",
      },
      {
        who: "Grandes entreprises et ETI",
        what: "Doivent également émettre leurs factures électroniques et transmettre les données concernées.",
      },
    ],
  },
  {
    date: "1ᵉʳ septembre 2027",
    entries: [
      {
        who: "PME et micro-entreprises",
        what: "Doivent à leur tour émettre leurs factures électroniques et effectuer le e-reporting concerné.",
      },
    ],
  },
];

/** §7 — Ce que le dispositif attend d'une plateforme, en trois idées. */
export interface PlatformRole {
  readonly title: string;
  readonly body: string;
}

export const PLATFORM_ROLES: readonly PlatformRole[] = [
  {
    title: "Émettre et recevoir",
    body: "Les factures électroniques passent par les plateformes prévues dans le dispositif français.",
  },
  {
    title: "Suivre",
    body: "Les statuts permettent aux entreprises de suivre le traitement de leurs factures.",
  },
  {
    title: "Transmettre",
    body: "Les données réglementaires prévues sont transmises à l'administration.",
  },
];
