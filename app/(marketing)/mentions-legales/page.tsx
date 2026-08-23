import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";
import { LegalDraftNotice } from "@/components/marketing/legal-notice";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergement, directeur de publication et contact.",
};

export default function LegalPage() {
  return (
    <PageShell eyebrow="Légal" title="Mentions légales" intro="Éditeur, hébergement, directeur de publication et contact.">
      <LegalDraftNotice />
      <Section title="Éditeur du site">
        <p>Raison sociale, forme juridique, capital social, adresse du siège, RCS et numéro de TVA intracommunautaire à compléter avant mise en ligne.</p>
      </Section>
      <Section title="Directeur de la publication">
        <p>Nom et qualité du représentant légal à compléter.</p>
      </Section>
      <Section title="Hébergement">
        <p>Le site est hébergé sur l'infrastructure Vercel. Les données applicatives sont stockées sur une base PostgreSQL gérée par Neon. Les coordonnées complètes des prestataires doivent figurer ici.</p>
      </Section>
      <Section title="Propriété intellectuelle">
        <p>L'ensemble des éléments du site est protégé. Toute reproduction sans autorisation est interdite.</p>
      </Section>
      <Section title="Contact">
        <p>contact@aequitas.fr</p>
      </Section>
    </PageShell>
  );
}
