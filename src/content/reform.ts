/**
 * Calendrier de la réforme.
 *
 * Source unique : la home et la page dédiée lisent le même contenu, pour
 * qu'une correction de date ne puisse pas n'être appliquée qu'à moitié.
 *
 * Les formulations restent prudentes — « selon le calendrier réglementaire
 * applicable » — parce que ce calendrier relève de l'administration et peut
 * évoluer. Aequitas ne présente pas ces dates comme sa propre garantie.
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
        what: "Doivent pouvoir recevoir des factures électroniques. C'est la première marche, et elle ne dépend pas de la taille de l'entreprise.",
      },
      {
        who: "Grandes entreprises et ETI",
        what: "Émission obligatoire, selon le calendrier réglementaire applicable.",
      },
    ],
  },
  {
    date: "1ᵉʳ septembre 2027",
    entries: [
      {
        who: "PME et micro-entreprises",
        what: "Émission obligatoire, selon le calendrier réglementaire applicable. Les petites structures sont concernées en dernier.",
      },
    ],
  },
];
