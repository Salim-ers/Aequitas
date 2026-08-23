import { baseUrl } from "@/src/lib/env";

/**
 * §54 — Données structurées.
 *
 * Uniquement des affirmations vérifiables : ni note d'évaluation, ni nombre
 * d'avis, ni logo client inventés. Le JSON est sérialisé avec les `<`
 * échappés, seule séquence capable de refermer un <script> depuis une chaîne.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function OrganizationJsonLd() {
  const url = baseUrl();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Aequitas",
        url,
        logo: `${url}/brand/aequitas-logo.svg`,
        description:
          "Logiciel de facturation électronique pour les entreprises françaises : devis, factures, paiements et préparation à la réforme.",
        areaServed: "FR",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@aequitas.fr",
          availableLanguage: "French",
        },
      }}
    />
  );
}

export function SoftwareJsonLd() {
  const url = baseUrl();
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Aequitas",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Logiciel de facturation",
        operatingSystem: "Web",
        url,
        inLanguage: "fr-FR",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: "29",
          highPrice: "199",
          offerCount: 3,
          url: `${url}/tarifs`,
        },
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}
