import type { Metadata } from "next";
import { PageShell, Section } from "@/components/marketing/page-shell";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Conformité",
  description:
    "Où en est Aequitas dans sa trajectoire vers une candidature en qualité de Plateforme Agréée, et ce que cela change aujourd'hui.",
};

/** §12 / §126 — Feuille de route affichée sans surpromesse. */
const ROADMAP = [
  { step: "Facturation SaaS", state: "Livré" },
  { step: "Gestion des factures", state: "Livré" },
  { step: "Formats électroniques", state: "En cours" },
  { step: "Routage électronique", state: "À venir" },
  { step: "E-reporting", state: "À venir" },
  { step: "Dépôt de candidature Plateforme Agréée", state: "À venir" },
  { step: "Interopérabilité officielle", state: "À venir" },
  { step: "Immatriculation", state: "À venir" },
] as const;

function tone(state: string) {
  if (state === "Livré") return "success" as const;
  if (state === "En cours") return "brass" as const;
  return "neutral" as const;
}

export default function CompliancePage() {
  return (
    <PageShell
      eyebrow="Statut réglementaire"
      title="Où nous en sommes, précisément"
      intro="Aequitas développe son infrastructure en vue d'une candidature en qualité de Plateforme Agréée. Cette page décrit l'état réel d'avancement, sans anticiper sur une décision qui ne nous appartient pas."
    >
      <Section title="Ce que nous ne disons pas">
        <p>
          Aequitas n&apos;est pas actuellement présentée comme Plateforme Agréée tant que
          l&apos;immatriculation correspondante n&apos;a pas été délivrée par
          l&apos;administration fiscale. Aucun logo officiel n&apos;est affiché sur ce site,
          et aucune fonctionnalité n&apos;est décrite comme agréée.
        </p>
        <p>
          Lorsque l&apos;application génère ou transmet un document dans un environnement qui
          n&apos;est pas raccordé à un canal officiel, elle l&apos;indique explicitement par la
          mention « Environnement de simulation ». Vous ne verrez jamais « Envoyé à la
          DGFiP » si l&apos;envoi n&apos;a pas réellement eu lieu.
        </p>
      </Section>

      <Section title="Feuille de route">
        <ul className="not-prose divide-y divide-[color:var(--color-line)] border-y border-line">
          {ROADMAP.map((item) => (
            <li key={item.step} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[14.5px] text-ink-soft">{item.step}</span>
              <Badge tone={tone(item.state)}>{item.state}</Badge>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Ce que vous pouvez faire dès aujourd'hui">
        <p>
          Émettre des factures numérotées séquentiellement, calculer la TVA sur plusieurs
          taux, suivre les règlements, produire des exports, et préparer vos données au
          format structuré. Ces fonctions ne dépendent d&apos;aucune décision administrative.
        </p>
      </Section>

      <Section title="Architecture prévue pour la suite">
        <p>
          Le cœur réglementaire est isolé derrière des interfaces dédiées. Le jour où il
          devra être opéré sur une infrastructure qualifiée distincte, l&apos;application ne
          changera pas : seuls les adaptateurs seront remplacés.
        </p>
      </Section>
    </PageShell>
  );
}
