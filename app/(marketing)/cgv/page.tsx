import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";
import { LegalDraftNotice } from "@/components/marketing/legal-notice";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Offres, prix, paiement, durée et résiliation de l'abonnement.",
};

export default function LegalPage() {
  return (
    <PageShell eyebrow="Légal" title="Conditions générales de vente" intro="Offres, prix, paiement, durée et résiliation de l'abonnement.">
      <LegalDraftNotice />
      <Section title="Offres et prix">
        <p>Les prix affichés sont hors taxes, par mois et par entreprise. Ils figurent sur la page Tarifs.</p>
      </Section>
      <Section title="Souscription et paiement">
        <p>L'abonnement est souscrit par carte via Stripe. Il est reconduit tacitement à chaque période.</p>
      </Section>
      <Section title="Essai gratuit">
        <p>Une période d'essai peut être proposée. À son terme, l'abonnement devient payant sauf résiliation avant échéance.</p>
      </Section>
      <Section title="Défaut de paiement">
        <p>En cas d'échec de prélèvement, une période de régularisation est accordée avant suspension de l'accès. Les données ne sont pas supprimées automatiquement.</p>
      </Section>
      <Section title="Résiliation">
        <p>La résiliation prend effet à la fin de la période en cours. L'accès reste ouvert jusqu'à cette date.</p>
      </Section>
      <Section title="Réversibilité">
        <p>Les exports CSV et PDF permettent de récupérer les données à tout moment.</p>
      </Section>
    </PageShell>
  );
}
