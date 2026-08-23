import {
  LayoutDashboard,
  Receipt,
  Users,
  Banknote,
  Send,
  Search,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { AequitasMark } from "@/components/brand/aequitas-logo";
import { cn } from "@/src/lib/utils";

/**
 * §52 — Maquettes produit réservées au site public.
 *
 * Les montants ci-dessous sont fictifs et illustratifs. Ces composants ne
 * doivent jamais être importés depuis /dashboard, qui lit les vraies données.
 */

const eur = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);

/** Fenêtre applicative : l'image de marque du produit sur la landing. */
export function MarketingDashboardPreview({ className }: { className?: string }) {
  const nav = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", active: true },
    { icon: Receipt, label: "Factures" },
    { icon: Users, label: "Clients" },
    { icon: Banknote, label: "Paiements" },
    { icon: Send, label: "Envois" },
  ];

  const rows = [
    { client: "Delaunay & Associés", amount: eur(4680), state: "Payée" },
    { client: "Atelier Verdier", amount: eur(1290), state: "Envoyée" },
    { client: "Groupe Marceau", amount: eur(2450), state: "En retard" },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <AequitasMark className="size-5" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
          Aequitas
        </span>
        <div className="ml-3 hidden flex-1 items-center gap-2 rounded-[var(--radius)] border border-line bg-surface-2 px-2.5 py-1.5 sm:flex">
          <Search className="size-3 text-faint" />
          <span className="text-[11px] text-faint">Rechercher un client, une facture…</span>
        </div>
        <span className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-soft text-[10px] font-semibold text-blue">
          SB
        </span>
      </div>

      <div className="flex">
        <div className="hidden w-40 shrink-0 border-r border-line bg-surface-2/60 p-2.5 sm:block">
          {nav.map((item) => (
            <div
              key={item.label}
              className={cn(
                "mb-0.5 flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-[11.5px]",
                item.active ? "bg-blue-soft font-medium text-blue" : "text-muted",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 bg-canvas p-4">
          <p className="text-[13px] font-semibold text-ink">
            Bonjour Salim, voici votre activité
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {[
              { label: "Encaissé ce mois", value: eur(24850) },
              { label: "En attente", value: eur(8420) },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[var(--radius)] border border-line bg-surface px-3 py-2.5"
              >
                <p className="text-[10.5px] text-faint">{kpi.label}</p>
                <p className="tabular mt-1 text-[17px] font-semibold text-ink">{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Courbe tracée à la main : ni image, ni librairie de graphiques. */}
          <div className="mt-2.5 rounded-[var(--radius)] border border-line bg-surface p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[11px] font-medium text-ink">Encaissements</p>
              <p className="text-[10px] text-faint">12 mois</p>
            </div>
            <svg viewBox="0 0 240 64" className="mt-2 h-16 w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="aeq-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 52 L30 47 L60 49 L90 38 L120 41 L150 28 L180 24 L210 14 L240 9 L240 64 L0 64 Z"
                fill="url(#aeq-spark)"
              />
              <path
                d="M0 52 L30 47 L60 49 L90 38 L120 41 L150 28 L180 24 L210 14 L240 9"
                fill="none"
                stroke="var(--color-blue)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="mt-2.5 overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
            {rows.map((row, index) => (
              <div
                key={row.client}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-[11px]",
                  index > 0 && "border-t border-line",
                )}
              >
                <span className="min-w-0 flex-1 truncate font-medium text-ink">
                  {row.client}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 text-[9.5px] font-medium",
                    row.state === "Payée" && "bg-success-soft text-success",
                    row.state === "Envoyée" && "bg-blue-soft text-blue",
                    row.state === "En retard" && "bg-danger-soft text-danger",
                  )}
                >
                  {row.state}
                </span>
                <span className="tabular w-16 shrink-0 text-right font-semibold text-ink">
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Carte « paiement reçu », posée en surimpression du dashboard. */
export function MarketingPaymentNotification({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-lg)] border border-line-strong bg-surface px-4 py-3 shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold text-ink">Paiement reçu</p>
        <p className="tabular text-[11.5px] text-muted">{eur(4680)} — Delaunay</p>
      </div>
    </div>
  );
}

/** Carte « facture envoyée », deuxième élément flottant du hero. */
export function MarketingInvoiceCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-52 rounded-[var(--radius-lg)] border border-line-strong bg-surface p-4 shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-faint">
          Facture
        </span>
        <span className="rounded-full bg-blue-soft px-1.5 py-0.5 text-[9.5px] font-medium text-blue">
          Envoyée
        </span>
      </div>
      <p className="tabular mt-2 text-[13px] font-semibold text-ink">F-2026-0149</p>
      <p className="mt-0.5 text-[11px] text-muted">Atelier Verdier</p>
      <div className="mt-3 flex items-baseline justify-between border-t border-line pt-2.5">
        <span className="text-[10.5px] text-faint">Total TTC</span>
        <span className="tabular text-[15px] font-semibold text-ink">{eur(1548)}</span>
      </div>
    </div>
  );
}

/** Suivi d'envoi réglementaire, en langage courant. */
export function MarketingCompliancePreview({ className }: { className?: string }) {
  const steps = [
    { label: "Facture créée", done: true },
    { label: "Informations vérifiées", done: true },
    { label: "Envoyée au client", done: true },
    { label: "Reçue", done: false },
  ];

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink">Suivi de la facture</p>
        <span className="tabular text-[11.5px] text-faint">F-2026-0148</span>
      </div>

      <ol className="mt-4">
        {steps.map((step, index) => (
          <li key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full border-2",
                  step.done
                    ? "border-success bg-success text-white"
                    : "border-line-strong bg-surface",
                )}
              >
                {step.done ? <Check className="size-2.5" strokeWidth={4} /> : null}
              </span>
              {index < steps.length - 1 ? (
                <span className={cn("w-0.5 flex-1", step.done ? "bg-success/30" : "bg-line")} />
              ) : null}
            </div>
            <p
              className={cn(
                "pb-4 text-[12.5px]",
                step.done ? "font-medium text-ink" : "text-faint",
              )}
            >
              {step.label}
            </p>
          </li>
        ))}
      </ol>

      <p className="flex items-center gap-1.5 border-t border-line pt-3 text-[11.5px] text-muted">
        <ArrowUpRight className="size-3 shrink-0 text-blue" />
        Aucune manipulation de votre part : le suivi avance tout seul.
      </p>
    </div>
  );
}
