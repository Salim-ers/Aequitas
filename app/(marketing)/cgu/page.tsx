import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";
import { LegalDraftNotice } from "@/components/marketing/legal-notice";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Règles d'accès et d'usage de la plateforme Aequitas.",
};

export default function LegalPage() {
  return (
    <PageShell eyebrow="Légal" title="Conditions générales d'utilisation" intro="Règles d'accès et d'usage de la plateforme Aequitas.">
      <LegalDraftNotice />
      <Section title="Objet">
        <p>Les présentes conditions régissent l'accès et l'utilisation de la plateforme.</p>
      </Section>
      <Section title="Compte et sécurité">
        <p>Chaque utilisateur est responsable de la confidentialité de ses identifiants. Un mot de passe d'au moins douze caractères est exigé.</p>
      </Section>
      <Section title="Usage acceptable">
        <p>Il est interdit de tenter d'accéder aux données d'une autre organisation, de contourner les limitations d'usage ou de perturber le service.</p>
      </Section>
      <Section title="Disponibilité">
        <p>Le service est fourni sans garantie de disponibilité continue, sauf engagement contractuel distinct.</p>
      </Section>
      <Section title="Résiliation">
        <p>Le compte peut être fermé en cas de manquement grave, après notification.</p>
      </Section>
    </PageShell>
  );
}
