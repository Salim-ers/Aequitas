import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Développeurs",
  description: "API REST Aequitas : clés, ressources, webhooks signés.",
};

export default function DevelopersPage() {
  return (
    <PageShell
      eyebrow="Développeurs"
      title="Une API pour tout ce que fait l'interface"
      intro="Base : https://api.aequitas.fr/v1. Authentification par clé Bearer. Réponses JSON, erreurs typées."
    >
      <Section title="Clés">
        <p>
          Les clés sont créées depuis l&apos;espace API de votre entreprise. La valeur
          complète est affichée une seule fois ; seul son empreinte est conservée. Une clé
          se révoque à tout moment sans invalider les autres.
        </p>
      </Section>
      <Section title="Ressources">
        <p>
          <code className="font-mono text-[13px]">/customers</code>,{" "}
          <code className="font-mono text-[13px]">/suppliers</code>,{" "}
          <code className="font-mono text-[13px]">/products</code>,{" "}
          <code className="font-mono text-[13px]">/quotes</code>,{" "}
          <code className="font-mono text-[13px]">/invoices</code>,{" "}
          <code className="font-mono text-[13px]">/payments</code>.
        </p>
      </Section>
      <Section title="Webhooks">
        <p id="webhooks">
          Événements émis : invoice.created, invoice.finalized, invoice.sent, invoice.paid,
          invoice.overdue, payment.created. Chaque livraison est signée, réessayée en cas
          d&apos;échec, et consultable dans le journal des livraisons.
        </p>
      </Section>
      <Section title="Montants">
        <p>
          Tous les montants circulent en chaînes décimales, jamais en nombres flottants.
          Envoyez « 780.00 », pas 780.
        </p>
      </Section>
    </PageShell>
  );
}
