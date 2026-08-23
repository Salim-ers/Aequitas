import type { Metadata } from "next";
import { KeyRound, Lock, ShieldCheck, ScrollText, Server, CreditCard } from "lucide-react";
import { SectionHeader } from "@/components/ui/page-header";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Sécurité",
  description:
    "Les mesures de sécurité réellement en place dans Aequitas : accès, chiffrement, permissions, traçabilité et infrastructure.",
};

/**
 * §53 / §73 — Uniquement des mesures implémentées.
 * Aucune certification n'est revendiquée tant qu'elle n'a pas été délivrée.
 */
const MEASURES = [
  {
    icon: KeyRound,
    title: "Accès",
    body: "Authentification par e-mail et mot de passe, douze caractères minimum. Les sessions ont une durée limitée et peuvent être révoquées. La double authentification est en cours de déploiement.",
  },
  {
    icon: Lock,
    title: "Chiffrement",
    body: "Les données sont chiffrées en transit et au repos. HSTS est actif, la politique de sécurité du contenu est restrictive, et l'inclusion du site dans un cadre tiers est interdite.",
  },
  {
    icon: ShieldCheck,
    title: "Permissions",
    body: "Six rôles, vérifiés côté serveur à chaque requête. Chaque donnée porte l'identifiant de son entreprise, résolu depuis la session : une valeur transmise par le navigateur n'est jamais acceptée.",
  },
  {
    icon: ScrollText,
    title: "Traçabilité",
    body: "Les actions sensibles sont consignées dans un journal en ajout seul. Mots de passe, jetons, codes à usage unique, IBAN complets et contenus de documents n'y figurent jamais.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    body: "Hébergement européen, base de données isolée par entreprise au niveau applicatif, et interdiction du cache partagé sur toutes les réponses contenant des données de compte.",
  },
  {
    icon: CreditCard,
    title: "Paiements",
    body: "Aequitas ne stocke aucune donnée de carte bancaire. Les paiements passent par Stripe ; les notifications reçues sont vérifiées par signature et traitées une seule fois.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <SectionHeader
            eyebrow="Sécurité"
            title="Vos données restent protégées."
            as="h1"
            description="Cette page décrit ce qui est implémenté aujourd'hui, et rien d'autre. Aucune certification n'est revendiquée tant qu'elle n'a pas été délivrée."
          />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {MEASURES.map((measure) => (
              <div key={measure.title} className="bg-surface p-6">
                <span className="inline-flex size-9 items-center justify-center rounded-[var(--radius)] bg-blue-soft text-blue">
                  <measure.icon className="size-4.5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-[16px] font-semibold text-ink">{measure.title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{measure.body}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            <Alert tone="info" title="Isolation vérifiée par les tests">
              Un jeu de tests automatisés vérifie qu&apos;un utilisateur d&apos;une
              entreprise ne peut atteindre les données d&apos;une autre. Cette vérification
              s&apos;exécute à chaque modification du code.
            </Alert>

            <Alert tone="warning" title="Signaler une vulnérabilité">
              Écrivez à{" "}
              <a
                href="mailto:securite@aequitas.fr"
                className="font-medium text-warning underline"
              >
                securite@aequitas.fr
              </a>
              . Nous accusons réception sous deux jours ouvrés et vous tenons informé du
              traitement.
            </Alert>
          </div>
        </div>
      </section>
    </>
  );
}
