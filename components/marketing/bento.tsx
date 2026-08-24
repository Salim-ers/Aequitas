import type { ReactNode } from "react";
import { ArrowRight, Check, Hash } from "lucide-react";
import { cn } from "@/src/lib/utils";

/**
 * Grille bento sur fond clair.
 *
 * Composition asymétrique : une colonne gauche empilant une carte courte et
 * une carte haute, et une zone droite de deux cartes surmontant une carte
 * large. Chaque carte porte un titre, une phrase, et un fragment
 * d'interface — pas une illustration décorative.
 *
 * Le relief vient de `card-3d` et `panel-3d` (voir globals.css) : dégradé
 * interne, liseré de lumière sur l'arête haute, ombres empilées. Le fragment
 * flotte d'un cran au-dessus de sa carte, ce qui creuse la profondeur.
 *
 * Les fragments sont fictifs et le disent. Aucun ne simule de statut
 * réglementaire.
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
        "card-3d flex flex-col overflow-hidden rounded-[28px] p-7 sm:p-9",
        className,
      )}
    >
      <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">{title}</h3>
      <p className="mt-2.5 text-[14.5px] leading-relaxed text-muted">{body}</p>
      {children ? <div className="mt-7 min-h-0 flex-1">{children}</div> : null}
    </div>
  );
}

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("panel-3d rounded-[16px] p-4", className)} aria-hidden="true">
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
        <span className="tabular text-[12.5px] font-semibold text-ink">F-2026-0148</span>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10.5px] font-medium text-muted">
          Brouillon
        </span>
      </div>

      <ul className="mt-4 space-y-2.5">
        {lines.map(([label, amount]) => (
          <li key={label} className="flex items-baseline justify-between gap-3 text-[12.5px]">
            <span className="min-w-0 truncate text-ink-soft">{label}</span>
            <span className="tabular shrink-0 text-muted">{amount} €</span>
          </li>
        ))}
      </ul>

      <dl className="mt-auto space-y-1.5 border-t border-line pt-4 text-[12.5px]">
        <div className="flex justify-between">
          <dt className="text-muted">Total HT</dt>
          <dd className="tabular text-ink-soft">6 930,00 €</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">TVA 20 %</dt>
          <dd className="tabular text-ink-soft">1 386,00 €</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-2.5">
          <dt className="font-semibold text-ink">Total TTC</dt>
          <dd className="tabular text-[18px] font-semibold text-ink">8 316,00 €</dd>
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
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-faint">
          Reste à encaisser
        </span>
        <span className="tabular text-[18px] font-semibold text-ink">{eur(8420)}</span>
      </div>

      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.client} className="flex items-center gap-3">
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                row.tone === "ok" && "bg-success",
                row.tone === "wait" && "bg-line-strong",
                row.tone === "late" && "bg-danger",
              )}
            />
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">
              {row.client}
            </span>
            <span
              className={cn(
                "shrink-0 text-[11px]",
                row.tone === "late" ? "text-danger" : "text-faint",
              )}
            >
              {row.detail}
            </span>
            <span className="tabular w-14 shrink-0 text-right text-[12.5px] font-semibold text-ink">
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
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="text-[13px] text-ink-soft">{check}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-line pt-3 text-[12px] text-faint">
        Rien n&apos;est envoyé tant qu&apos;une information manque.
      </p>
    </Panel>
  );
}

/** Parcours d'une facture, dernier maillon explicitement en préparation. */
function PathwayFragment() {
  const nodes = [
    { label: "Votre entreprise", planned: false, brand: false },
    { label: "Aequitas", planned: false, brand: true },
    { label: "Écosystème français", planned: true, brand: false },
  ];

  return (
    <Panel className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {nodes.map((node, index) => (
        <div key={node.label} className="flex flex-1 items-center gap-4">
          <div
            className={cn(
              "flex-1 rounded-[12px] border px-4 py-3 text-center text-[13px]",
              node.brand
                ? "border-navy bg-navy font-semibold text-white shadow-sm"
                : node.planned
                  ? "border-dashed border-line-strong text-faint"
                  : "border-line bg-surface-2 text-ink-soft",
            )}
          >
            {node.label}
            {node.planned ? (
              <span className="mt-1 block text-[10px] uppercase tracking-[0.06em] text-faint">
                Après immatriculation
              </span>
            ) : null}
          </div>
          {index < nodes.length - 1 ? (
            <ArrowRight
              className="hidden size-4 shrink-0 text-line-strong sm:block"
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
    <section className="relative overflow-hidden border-b border-line bg-canvas">
      {/* Voile coloré très dilué : il détache les cartes du fond sans le teinter. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(48%_60%_at_50%_0%,var(--color-blue-soft),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[var(--container-page)] px-5 py-20 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
          <div className="max-w-xl">
            <span className="tricolore" aria-hidden="true" />
            <h2 className="display-2 mt-5 text-ink">Tout votre cycle de facturation.</h2>
          </div>
          {cta}
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <div className="flex min-w-0 flex-col gap-5">
            <Card
              title="Numérotation continue"
              body="Une séquence sans trou, année après année, comme l'exige la réglementation."
            >
              <div className="panel-3d flex items-center gap-2.5 rounded-[14px] px-4 py-3">
                <Hash className="size-3.5 shrink-0 text-faint" aria-hidden="true" />
                <span className="tabular text-[13px] font-medium text-ink-soft">
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
