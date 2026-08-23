import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Sécurité",
  description: "Les mesures de sécurité réellement en place dans Aequitas.",
};

/** §73 — Uniquement des mesures implémentées. Aucune certification revendiquée. */
export default function SecurityPage() {
  return (
    <PageShell
      eyebrow="Sécurité"
      title="Les mesures réellement en place"
      intro="Cette page décrit ce qui est implémenté aujourd'hui. Aucune certification n'est revendiquée tant qu'elle n'a pas été délivrée."
    >
      <Section title="Accès et identité">
        <p>
          Authentification par email et mot de passe, longueur minimale de 12 caractères,
          sessions à durée limitée et révocables. La double authentification et les clés
          d&apos;accès matérielles sont en cours de déploiement.
        </p>
      </Section>

      <Section title="Isolation des données">
        <p>
          Chaque donnée métier porte l&apos;identifiant de son entreprise. Toute requête
          applicative résout cet identifiant côté serveur à partir de la session : une
          valeur transmise par le navigateur n&apos;est jamais acceptée. Un jeu de tests
          vérifie qu&apos;un utilisateur d&apos;une entreprise ne peut atteindre les données
          d&apos;une autre.
        </p>
      </Section>

      <Section title="Transport et en-têtes">
        <p>
          HSTS, politique de sécurité du contenu restrictive, protection contre
          l&apos;inclusion en cadre, et interdiction du cache partagé sur les réponses
          applicatives.
        </p>
      </Section>

      <Section title="Journalisation">
        <p>
          Les actions sensibles sont consignées dans un journal en ajout seul. Les mots de
          passe, jetons, codes à usage unique, IBAN complets et contenus de documents ne
          sont jamais écrits dans les journaux.
        </p>
      </Section>

      <Section title="Paiements">
        <p>
          Aequitas ne stocke aucune donnée de carte bancaire. Les paiements
          d&apos;abonnement passent par Stripe ; les notifications reçues sont vérifiées par
          signature et traitées une seule fois.
        </p>
      </Section>

      <Section title="Signaler une vulnérabilité">
        <p>
          Écrivez à securite@aequitas.fr. Nous accusons réception sous deux jours ouvrés.
        </p>
      </Section>
    </PageShell>
  );
}
