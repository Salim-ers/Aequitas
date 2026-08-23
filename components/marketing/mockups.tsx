import {
  Home,
  Receipt,
  Users,
  Banknote,
  Send,
  Bell,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { AequitasMark } from "@/components/brand/aequitas-logo";
import { cn } from "@/src/lib/utils";

/**
 * Maquettes produit réservées au site public.
 *
 * Les montants sont fictifs et illustratifs, et l'étiquette « Aperçu » le dit
 * à l'écran. Ces composants ne sont jamais importés depuis /dashboard, qui lit
 * la base. Aucun statut réglementaire n'est simulé ici : une facture y est
 * « envoyée » ou « payée », jamais « transmise à l'administration ».
 */

const eur = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);

/** Bandeau discret qui empêche de confondre la démonstration avec l'application. */
function PreviewTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-[var(--radius-xs)] border border-line bg-surface/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-faint backdrop-blur",
        className,
      )}
    >
      Aperçu
    </span>
  );
}

/** Fenêtre applicative : l'image de marque du produit sur la landing. */
export function MarketingDashboardPreview({ className }: { className?: string }) {
  const nav = [
    { icon: Home, label: "Accueil", active: true },
    { icon: Receipt, label: "Factures" },
    { icon: Users, label: "Clients" },
    { icon: Banknote, label: "Paiements" },
    { icon: Send, label: "Suivi des factures" },
  ];

  const rows = [
    { client: "Delaunay & Associés", amount: eur(4680), state: "Payée" },
    { client: "Atelier Verdier", amount: eur(1290), state: "Envoyée" },
    { client: "Groupe Marceau", amount: eur(2450), state: "En retard" },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      {/* Barre supérieure */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <AequitasMark className="size-5" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy">
          Aequitas
        </span>
        <PreviewTag />
        <span className="ml-auto flex items-center gap-3">
          <Bell className="size-3.5 text-faint" />
          <span className="flex size-6 items-center justify-center rounded-full bg-navy text-[10px] font-semibold text-white">
            SC
          </span>
        </span>
      </div>

      <div className="flex">
        {/* Navigation */}
        <div className="hidden w-44 shrink-0 border-r border-line p-2.5 sm:block">
          {nav.map((item) => (
            <div
              key={item.label}
              className={cn(
                "mb-0.5 flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-[11.5px]",
                item.active ? "bg-blue-soft font-medium text-navy" : "text-muted",
              )}
            >
              <item.icon
                className={cn("size-3.5", item.active ? "text-blue" : "text-faint")}
              />
              {item.label}
            </div>
          ))}
        </div>

        {/* Contenu */}
        <div className="min-w-0 flex-1 bg-canvas p-4 sm:p-5">
          <p className="text-[14px] font-semibold text-ink">Bonjour Salim</p>

          <div className="mt-3.5 grid grid-cols-2 gap-3">
            {[
              { label: "Encaissés", value: eur(24850) },
              { label: "À recevoir", value: eur(8420) },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-[var(--radius)] border border-line bg-surface px-3.5 py-3"
              >
                <p className="text-[10.5px] uppercase tracking-[0.06em] text-faint">
                  {kpi.label}
                </p>
                <p className="tabular mt-1.5 text-[19px] font-semibold tracking-tight text-ink">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* Courbe tracée à la main : ni image, ni librairie de graphiques. */}
          <div className="mt-3 rounded-[var(--radius)] border border-line bg-surface p-3.5">
            <div className="flex items-baseline justify-between">
              <p className="text-[11.5px] font-medium text-ink">Encaissements</p>
              <p className="text-[10px] text-faint">12 mois</p>
            </div>
            <svg viewBox="0 0 240 60" className="mt-2.5 h-[4.5rem] w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="aeq-spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 48 L30 44 L60 46 L90 35 L120 38 L150 26 L180 22 L210 13 L240 8 L240 60 L0 60 Z"
                fill="url(#aeq-spark)"
              />
              <path
                d="M0 48 L30 44 L60 46 L90 35 L120 38 L150 26 L180 22 L210 13 L240 8"
                fill="none"
                stroke="var(--color-blue)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <p className="mt-4 text-[11.5px] font-medium text-ink">Factures récentes</p>
          <div className="mt-2 overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
            {rows.map((row, index) => (
              <div
                key={row.client}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 text-[11.5px]",
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

/** Carte « facture reçue », première des deux surimpressions du hero. */
export function MarketingDeliveryCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-lg)] border border-line-strong bg-surface px-4 py-3 shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-soft text-blue">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold text-ink">Facture reçue par votre client</p>
        <p className="text-[11.5px] text-muted">Atelier Verdier — il y a 2 min</p>
      </div>
    </div>
  );
}

/** Carte « encaissement », seconde surimpression. Pas plus de deux. */
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
        <ArrowUpRight className="size-4" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="tabular text-[12.5px] font-semibold text-ink">{eur(4680)} encaissés</p>
        <p className="text-[11.5px] text-muted">Delaunay &amp; Associés</p>
      </div>
    </div>
  );
}

/**
 * Suivi d'une facture, en langage courant.
 * Aucune étape ne prétend à une transmission à l'administration.
 */
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
        "relative rounded-[var(--radius-lg)] border border-line bg-surface p-5 shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <PreviewTag className="absolute right-3 top-3" />

      <p className="text-[13px] font-semibold text-ink">Suivi de la facture</p>
      <span className="tabular text-[11.5px] text-faint">F-2026-0148</span>

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

      <p className="border-t border-line pt-3 text-[11.5px] leading-relaxed text-muted">
        Aucune manipulation de votre part : le suivi avance tout seul.
      </p>
    </div>
  );
}

/**
 * Petits aperçus d'interface qui illustrent une étape ou un bénéfice.
 * Volontairement schématiques : ils montrent une forme, pas de fausses données
 * présentées comme réelles.
 */
export function MarketingPanel({
  title,
  rows,
  footer,
  className,
}: {
  title: string;
  rows: readonly (readonly [string, string])[];
  footer?: readonly [string, string];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <p className="text-[13px] font-semibold text-ink">{title}</p>
        <PreviewTag />
      </div>
      <ul>
        {rows.map((row, index) => (
          <li
            key={row[0]}
            className={cn(
              "flex items-center justify-between gap-4 px-5 py-3 text-[13px]",
              index > 0 && "border-t border-line",
            )}
          >
            <span className="min-w-0 truncate text-ink-soft">{row[0]}</span>
            <span className="tabular shrink-0 font-medium text-muted">{row[1]}</span>
          </li>
        ))}
      </ul>
      {footer ? (
        <div className="flex items-baseline justify-between border-t border-line bg-surface-2/60 px-5 py-3.5">
          <span className="text-[12.5px] text-muted">{footer[0]}</span>
          <span className="tabular text-[15px] font-semibold text-ink">{footer[1]}</span>
        </div>
      ) : null}
    </div>
  );
}
