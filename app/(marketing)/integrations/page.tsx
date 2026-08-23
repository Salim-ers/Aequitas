import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";

export const metadata: Metadata = { title: "Intégrations" };

export default function IntegrationsPage() {
  return (
    <PageShell
      eyebrow="Intégrations"
      title="Connecter Aequitas à vos outils"
      intro="Les connecteurs natifs arrivent progressivement. En attendant, l'API et les webhooks couvrent l'essentiel des besoins."
    >
      <Section title="Disponible">
        <p>API REST, webhooks sortants signés, exports CSV et PDF.</p>
      </Section>
      <Section title="En préparation">
        <p>
          Exports comptables aux formats attendus par les cabinets, rapprochement bancaire,
          et connecteurs vers les principaux outils de gestion.
        </p>
      </Section>
    </PageShell>
  );
}
