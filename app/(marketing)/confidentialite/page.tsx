import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";
import { LegalDraftNotice } from "@/components/marketing/legal-notice";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données sont traitées, pourquoi, combien de temps, et quels sont vos droits.",
};

export default function LegalPage() {
  return (
    <PageShell eyebrow="Légal" title="Politique de confidentialité" intro="Quelles données sont traitées, pourquoi, combien de temps, et quels sont vos droits.">
      <LegalDraftNotice />
      <Section title="Responsable de traitement">
        <p>L'éditeur du site, dont les coordonnées figurent dans les mentions légales.</p>
      </Section>
      <Section title="Données traitées">
        <p>Données de compte (nom, adresse email), données d'entreprise (raison sociale, SIREN, SIRET, TVA, adresse), données de facturation créées par l'utilisateur, journaux techniques et journaux d'audit. Aucune donnée de carte bancaire n'est stockée : les paiements d'abonnement sont traités par Stripe.</p>
      </Section>
      <Section title="Finalités et bases légales">
        <p>Exécution du contrat pour la fourniture du service, obligation légale pour la conservation des documents comptables, intérêt légitime pour la sécurité et la prévention de la fraude.</p>
      </Section>
      <Section title="Durées de conservation">
        <p>Les durées applicables aux pièces comptables et aux journaux doivent être fixées avec un conseil, en cohérence avec les obligations de conservation en vigueur.</p>
      </Section>
      <Section title="Sous-traitants">
        <p>Vercel (hébergement), Neon (base de données), Stripe (paiement des abonnements). La liste complète et les localisations doivent être tenues à jour.</p>
      </Section>
      <Section title="Vos droits">
        <p>Accès, rectification, effacement, limitation, opposition et portabilité. Écrivez à privacy@aequitas.fr. Vous pouvez également saisir la CNIL.</p>
      </Section>
    </PageShell>
  );
}
