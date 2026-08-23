import type { ReactNode } from "react";
import { ArrowRight, Check, Hash } from "lucide-react";
import { cn } from "@/src/lib/utils";

/**
 * Grille bento sur fond navy.
 *
 * Composition asymétrique : une colonne gauche empilant une carte courte et
 * une carte haute, et une zone droite de deux cartes surmontant une carte
 * large. Chaque carte porte un titre, une phrase, et un fragment
 * d'interface — pas une illustration décorative.
 *
 * Les fragments sont fictifs et le disent : l'étiquette « Aperçu » de la
 * section couvre l'ensemble. Aucun ne simule de statut réglementaire.
 */

function Card({
  title,
  body,
  children,
  className,
}: {
  title: string;
  body: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.045] p-7 transition-colors duration-200 hover:border-white/20",
        className,
      )}
    >
      <h3 className="text-[19px] font-semibold tracking-[-0.01em] text-white">{title}</h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-white/60">{body}</p>
      {children ? <div className="mt-7 min-h-0 flex-1">{children}</div> : null}
    </div>
  );
}

/** Surface interne d'un fragment d'interface. */
function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-white/10 bg-navy/60 p-4 backdrop-blur-sm",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

const eur = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

/** Facture en cours de saisie, totaux calculés au fil de l'eau. */
function InvoiceFragment() {
  const lines = [
    ["Accompagnement — 5 j", "3 900,00"],
    ["Reprise d'historique", "2 160,00"],
    ["Maintenance", "870,00"],
  ];

  return (
    <Panel className="flex h-full flex-col">
      <div className="flex items-baseline justify-between">
        <span className="tabular text-[12px] font-semibold text-white">F-2026-0148</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
          Brouillon
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {lines.map(([label, amount]) => (
          <li key={label} className="flex items-baseline justify-between gap-3 text-[12px]">
            <span className="min-w-0 truncate text-white/70">{label}</span>
            <span className="tabular shrink-0 text-white/50">{amount} €</span>
          </li>
        ))}
      </ul>

      <dl className="mt-auto space-y-1.5 border-t border-white/10 pt-4 text-[12px]">
        <div className="flex justify-between">
          <dt className="text-white/50">Total HT</dt>
          <dd className="tabular text-white/70">6 930,00 €</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-white/50">TVA 20 %</dt>
          <dd className="tabular text-white/70">1 386,00 €</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-white/10 pt-2.5">
          <dt className="font-semibold text-white">Total TTC</dt>
          <dd className="tabular text-[17px] font-semibold text-white">8 316,00 €</dd>
        </div>
      </dl>
    </Panel>
  );
}

/** Règlements et retards. */
function TreasuryFragment() {
  const rows = [
    { client: "Delaunay", detail: "Payée", amount: eur(4680), tone: "ok" as const },
    { client: "Verdier", detail: "Échéance dans 6 j", amount: eur(1290), tone: "wait" as const },
    { client: "Marceau", detail: "Retard de 12 j", amount: eur(2450), tone: "late" as const },
  ];

  return (
    <Panel>
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.08em] text-white/45">
          Reste à encaisser
        </span>
        <span className="tabular text-[17px] font-semibold text-white">{eur(8420)}</span>
      </div>

      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.client} className="flex items-center gap-3">
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                row.tone === "ok" && "bg-[#5ee0a0]",
                row.tone === "wait" && "bg-white/40",
                row.tone === "late" && "bg-[#ff7a70]",
              )}
            />
            <span className="min-w-0 flex-1 truncate text-[12px] text-white/80">
              {row.client}
            </span>
            <span
              className={cn(
                "shrink-0 text-[10.5px]",
                row.tone === "late" ? "text-[#ff7a70]" : "text-white/45",
              )}
            >
              {row.detail}
            </span>
            <span className="tabular w-14 shrink-0 text-right text-[12px] font-medium text-white">
              {row.amount}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Contrôles passés avant envoi. */
function ChecksFragment() {
  const checks = ["Informations entreprise", "Informations client", "Numérotation et TVA"];

  return (
    <Panel>
      <ul className="space-y-3">
        {checks.map((check) => (
          <li key={check} className="flex items-center gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#5ee0a0]/15 text-[#5ee0a0]">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="text-[12.5px] text-white/75">{check}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-white/10 pt-3 text-[11.5px] text-white/45">
        Rien n&apos;est envoyé tant qu&apos;une information manque.
      </p>
    </Panel>
  );
}

/** Parcours d'une facture, dernier maillon explicitement en préparation. */
function PathwayFragment() {
  const nodes = [
    { label: "Votre entreprise", planned: false },
    { label: "Aequitas", planned: false, brand: true },
    { label: "Écosystème français", planned: true },
  ];

  return (
    <Panel className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {nodes.map((node, index) => (
        <div key={node.label} className="flex flex-1 items-center gap-4">
          <div
            className={cn(
              "flex-1 rounded-[10px] border px-4 py-3 text-center text-[12.5px]",
              node.brand
                ? "border-white/30 bg-white/10 font-semibold text-white"
                : node.planned
                  ? "border-dashed border-white/20 text-white/50"
                  : "border-white/12 bg-white/[0.05] text-white/80",
            )}
          >
            {node.label}
            {node.planned ? (
              <span className="mt-1 block text-[10px] uppercase tracking-[0.06em] text-white/35">
                Après immatriculation
              </span>
            ) : null}
          </div>
          {index < nodes.length - 1 ? (
            <ArrowRight
              className="hidden size-4 shrink-0 text-white/25 sm:block"
              aria-hidden="true"
            />
          ) : null}
        </div>
      ))}
    </Panel>
  );
}

export function ProductBento({ cta }: { cta?: ReactNode }) {
  return (
    <section className="on-navy border-b border-line bg-navy">
      <div className="mx-auto max-w-[var(--container-page)] px-5 py-24 lg:px-8 lg:py-32">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
          <div className="max-w-xl">
            <span className="tricolore" aria-hidden="true" />
            <h2 className="display-2 mt-5 text-white">Tout votre cycle de facturation.</h2>
          </div>
          {cta}
        </div>

        {/* Colonne gauche empilée, zone droite en 2 × 2 dont une carte large. */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-5">
            <Card
              title="Numérotation continue"
              body="Une séquence sans trou, année après année, comme l'exige la réglementation."
            >
              <div className="flex items-center gap-2.5 rounded-[10px] border border-white/10 bg-navy/60 px-3.5 py-2.5">
                <Hash className="size-3.5 shrink-0 text-white/40" aria-hidden="true" />
                <span className="tabular text-[12.5px] text-white/80">
                  F-2026-0146 · 0147 · 0148
                </span>
              </div>
            </Card>

            <Card
              className="flex-1"
              title="Facturez sans friction"
              body="Un devis accepté devient une facture en un clic. La TVA se calcule pendant que vous saisissez."
            >
              <InvoiceFragment />
            </Card>
          </div>

          <div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:col-span-2">
            <Card
              title="Suivez votre trésorerie"
              body="Chaque règlement met le solde à jour. Les retards remontent d'eux-mêmes."
            >
              <TreasuryFragment />
            </Card>

            <Card
              title="Contrôles avant envoi"
              body="Les informations attendues sont vérifiées, en langage clair, avant que la facture parte."
            >
              <ChecksFragment />
            </Card>

            <Card
              className="sm:col-span-2"
              title="Préparez la réforme sans changer vos habitudes"
              body="Aequitas absorbe la complexité réglementaire. Le dernier maillon ne sera actif qu'après notre immatriculation."
            >
              <PathwayFragment />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
