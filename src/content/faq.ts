/**
 * Questions fréquentes.
 *
 * Source unique, partagée entre la home et les données structurées : une
 * réponse affichée et une réponse déclarée à un moteur de recherche ne
 * doivent jamais diverger.
 *
 * La dernière question est la plus sensible : tant que l'immatriculation
 * n'est pas délivrée, la réponse doit le dire sans ambiguïté.
 */

export interface FaqItem {
  readonly q: string;
  readonly a: string;
}

export const HOME_FAQ: readonly FaqItem[] = [
  {
    q: "Qu'est-ce que la facturation électronique ?",
    a: "C'est une facture émise, transmise et reçue sous une forme structurée, que les logiciels peuvent lire directement. Un PDF envoyé par e-mail n'en est pas une : il est lisible par un humain, pas exploitable automatiquement.",
  },
  {
    q: "Mon entreprise est-elle concernée ?",
    a: "Oui. La réforme concerne toutes les entreprises établies en France et assujetties à la TVA, y compris les indépendants et les très petites structures. Seule la date à laquelle vous devrez émettre vos factures sous forme électronique dépend de votre taille.",
  },
  {
    q: "À partir de quand ?",
    a: "À partir de septembre 2026, toutes les entreprises doivent pouvoir recevoir des factures électroniques. L'obligation d'émettre s'échelonne ensuite, selon le calendrier réglementaire applicable à votre taille d'entreprise.",
  },
  {
    q: "Puis-je continuer à envoyer des PDF par e-mail ?",
    a: "Pour vos factures entre entreprises, non : elles devront circuler par une plateforme. Vos factures adressées à des particuliers ne sont pas concernées de la même manière.",
  },
  {
    q: "Qu'est-ce qu'une Plateforme Agréée ?",
    a: "Dans le nouveau système français, les Plateformes Agréées assurent l'échange des factures électroniques entre entreprises et la transmission des données prévues à l'administration fiscale.",
  },
  {
    q: "Aequitas est-elle déjà Plateforme Agréée ?",
    a: "Non. Aequitas prépare actuellement son infrastructure en vue de sa démarche d'immatriculation. Le statut de Plateforme Agréée ne sera affiché qu'après son obtention officielle.",
  },
];
