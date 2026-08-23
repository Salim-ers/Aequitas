import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Facturation électronique",
  description:
    "Factur-X, UBL, CII, cycle de vie, e-reporting et interopérabilité : comment Aequitas structure vos factures.",
};

export default function ElectronicInvoicingPage() {
  return (
    <PageShell
      eyebrow="Formats et échanges"
      title="Une facture, plusieurs représentations"
      intro="Aequitas ne stocke pas une facture « au format Factur-X ». Elle stocke une facture, puis la rend dans le format attendu par le destinataire."
    >
      <Section title="Le modèle canonique">
        <p>
          Chaque facture est projetée dans une structure pivot qui contient le vendeur,
          l&apos;acheteur, les lignes, la ventilation de TVA et les conditions de règlement.
          Les adaptateurs de format lisent cette structure, jamais la base directement.
        </p>
      </Section>

      <Section title="Factur-X">
        <p>
          Un PDF lisible par un humain, contenant les mêmes données sous forme structurée.
          Le rendu produit les deux à partir de la même source, ce qui interdit toute
          divergence entre ce qui est lu et ce qui est traité.
        </p>
      </Section>

      <Section title="UBL et CII">
        <p>
          Deux adaptateurs distincts, alimentés par le même modèle. Ajouter un format ne
          modifie ni la saisie, ni le calcul, ni la base.
        </p>
      </Section>

      <Section title="Cycle de vie et e-reporting">
        <p>
          Les changements d&apos;état d&apos;une facture transmise sont conservés et
          horodatés. Les données de reporting sont construites à partir des mêmes montants
          que ceux figurant sur la facture.
        </p>
      </Section>

      <Section title="Un mot sur le calendrier">
        <p>
          Les fonctionnalités réglementaires sont déployées progressivement en fonction de
          l&apos;avancement de l&apos;immatriculation Aequitas. Lorsqu&apos;un canal officiel
          n&apos;est pas raccordé, l&apos;interface affiche « Environnement de simulation ».
        </p>
      </Section>
    </PageShell>
  );
}
