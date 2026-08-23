import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Fonctionnalités",
  description: "Devis, factures, avoirs, achats, paiements, équipe, API : le tour d'Aequitas.",
};

export default function FeaturesPage() {
  return (
    <PageShell
      eyebrow="Produit"
      title="Le tour du propriétaire"
      intro="Aequitas couvre le cycle commercial d'une entreprise française, de la proposition envoyée au règlement encaissé."
    >
      <Section title="Ventes">
        <p>
          Devis avec suivi d&apos;acceptation et conversion en facture. Factures avec calcul
          en temps réel du HT, des remises, de la TVA par taux et du reste à payer. Avoirs
          rattachés à la facture qu&apos;ils rectifient.
        </p>
      </Section>
      <Section title="Achats">
        <p>
          Dépôt des factures fournisseurs, rapprochement, suivi des échéances et des
          règlements sortants.
        </p>
      </Section>
      <Section title="Référentiels">
        <p>
          Clients et fournisseurs avec SIREN, SIRET, TVA intracommunautaire et conditions de
          règlement. Catalogue d&apos;articles et de prestations avec taux de TVA par défaut.
        </p>
      </Section>
      <Section title="Organisation">
        <p>
          Invitations par email, six rôles, permissions vérifiées côté serveur, journal
          d&apos;audit consultable.
        </p>
      </Section>
    </PageShell>
  );
}
