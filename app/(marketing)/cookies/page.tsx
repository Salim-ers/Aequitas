import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";
import { LegalDraftNotice } from "@/components/marketing/legal-notice";

export const metadata: Metadata = {
  title: "Cookies",
  description: "Ce qui est déposé sur votre navigateur, et pourquoi.",
};

export default function LegalPage() {
  return (
    <PageShell eyebrow="Légal" title="Cookies" intro="Ce qui est déposé sur votre navigateur, et pourquoi.">
      <LegalDraftNotice />
      <Section title="Cookies strictement nécessaires">
        <p>Un cookie de session est déposé pour vous maintenir connecté. Il est indispensable au fonctionnement du service et ne requiert pas de consentement.</p>
      </Section>
      <Section title="Mesure d'audience">
        <p>Aucune technologie de mesure ou de publicité n'est chargée avant recueil de votre consentement, lorsque celui-ci est requis.</p>
      </Section>
      <Section title="Paiement">
        <p>Lors d'un paiement, Stripe peut déposer des cookies nécessaires à la détection de la fraude.</p>
      </Section>
      <Section title="Gérer vos choix">
        <p>Vous pouvez à tout moment supprimer les cookies depuis les réglages de votre navigateur.</p>
      </Section>
    </PageShell>
  );
}
