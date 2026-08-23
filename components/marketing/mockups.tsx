import {
  Home,
  Receipt,
  Users,
  Banknote,
  Send,
  Search,
  Bell,
  Check,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AequitasMark } from "@/components/brand/aequitas-logo";
import { cn } from "@/src/lib/utils";

/**
 * Maquettes produit du site public.
 *
 * Trois grandes compositions plutôt qu'une collection de vignettes : une
 * fenêtre applicative, une facture avec son suivi, une vue trésorerie.
 * Chacune porte l'étiquette « Aperçu » — leurs montants sont illustratifs et
 * ne doivent jamais être pris pour des données réelles.
 *
 * Aucun statut réglementaire n'est simulé : une facture y est « préparée »,
 * « envoyée » ou « payée », jamais « transmise à l'administration ».
 * Ces composants ne sont pas importés depuis /dashboard, qui lit la base.
 */

const eur = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

function PreviewTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-line bg-surface/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-faint",
        className,
      )}
    >
      Aperçu
    </span>
  );
}

/** Châssis commun : c'est lui qui donne le grain « application réelle ». */
function AppWindow({
  children,
  className,
  active,
}: {
  children: React.ReactNode;
  className?: string;
  active: string;
}) {
  const nav = [
    { icon: Home, label: "Accueil" },
    { icon: Receipt, label: "Factures" },
    { icon: Users, label: "Clients" },
    { icon: Banknote, label: "Paiements" },
    { icon: Send, label: "Suivi" },
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border border-line/80 bg-surface shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
        <AequitasMark className="size-5" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy">
          Aequitas
        </span>
        <PreviewTag className="ml-1" />

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-[11px] text-faint md:flex">
            <Search className="size-3" />
            Rechercher
          </span>
          <Bell className="size-4 text-faint" />
          <span className="flex size-7 items-center justify-center rounded-full bg-navy text-[10.5px] font-semibold text-white">
            SC
          </span>
        </div>
      </div>

      <div className="flex">
        <div className="hidden w-48 shrink-0 border-r border-line p-3 lg:block">
          {nav.map((item) => (
            <div
              key={item.label}
              className={cn(
                "mb-0.5 flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[12px]",
                item.label === active
                  ? "bg-blue-soft font-medium text-navy"
                  : "text-muted",
              )}
            >
              <item.icon
                className={cn(
                  "size-3.5",
                  item.label === active ? "text-blue" : "text-faint",
                )}
              />
              {item.label}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 bg-canvas p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

/** Courbe tracée à la main : ni image, ni librairie de graphiques. */
function Sparkline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 72"
      className={cn("w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="aeq-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0.14" />
          <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 58 L40 54 L80 57 L120 42 L160 46 L200 31 L240 26 L280 15 L320 9 L320 72 L0 72 Z"
        fill="url(#aeq-area)"
      />
      <path
        d="M0 58 L40 54 L80 57 L120 42 L160 46 L200 31 L240 26 L280 15 L320 9"
        fill="none"
        stroke="var(--color-blue)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="320" cy="9" r="3.5" fill="var(--color-blue)" />
    </svg>
  );
}

const KPIS = [
  { label: "Encaissé ce mois", value: eur(24850), delta: "+12 %", up: true },
  { label: "À recevoir", value: eur(8420), delta: "6 factures", up: null },
  { label: "En retard", value: eur(1350), delta: "2 factures", up: false },
];

const ROWS = [
  { client: "Delaunay & Associés", ref: "F-2026-0148", amount: eur(4680), state: "Payée" },
  { client: "Atelier Verdier", ref: "F-2026-0147", amount: eur(1290), state: "Envoyée" },
  { client: "Groupe Marceau", ref: "F-2026-0146", amount: eur(2450), state: "En retard" },
  { client: "Studio Bellac", ref: "F-2026-0145", amount: eur(3120), state: "Payée" },
];

function StateChip({ state }: { state: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
        state === "Payée" && "bg-success-soft text-success",
        state === "Envoyée" && "bg-blue-soft text-blue",
        state === "En retard" && "bg-danger-soft text-danger",
        state === "Préparée" && "bg-surface-2 text-muted",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {state}
    </span>
  );
}

/** Maquette principale : hero et grand bloc produit. */
export function DashboardMockup({ className }: { className?: string }) {
  return (
    <AppWindow active="Accueil" className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[15px] font-semibold text-ink">Bonjour Salim</p>
        <p className="text-[11px] text-faint">Août 2026</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-[10px] border border-line bg-surface px-4 py-3.5"
          >
            <p className="text-[10.5px] uppercase tracking-[0.07em] text-faint">
              {kpi.label}
            </p>
            <p className="tabular mt-2 text-[21px] font-semibold tracking-[-0.02em] text-ink">
              {kpi.value}
            </p>
            <p
              className={cn(
                "mt-1.5 flex items-center gap-1 text-[11px]",
                kpi.up === true && "text-success",
                kpi.up === false && "text-danger",
                kpi.up === null && "text-faint",
              )}
            >
              {kpi.up === true ? <ArrowUpRight className="size-3" /> : null}
              {kpi.up === false ? <ArrowDownRight className="size-3" /> : null}
              {kpi.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-[10px] border border-line bg-surface p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-[12px] font-medium text-ink">Encaissements</p>
          <span className="flex gap-1">
            {["30 j", "3 mois", "12 mois"].map((range) => (
              <span
                key={range}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  range === "12 mois" ? "bg-surface-2 font-medium text-ink" : "text-faint",
                )}
              >
                {range}
              </span>
            ))}
          </span>
        </div>
        <Sparkline className="mt-3 h-20" />
      </div>

      <div className="mt-3 overflow-hidden rounded-[10px] border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <p className="text-[12px] font-medium text-ink">Factures récentes</p>
          <span className="text-[11px] text-faint">Tout voir</span>
        </div>
        {ROWS.map((row, index) => (
          <div
            key={row.ref}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-[11.5px]",
              index > 0 && "border-t border-line",
            )}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-2 text-[9px] font-semibold text-muted">
              {row.client.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium text-ink">
              {row.client}
            </span>
            <span className="tabular hidden shrink-0 text-faint sm:block">{row.ref}</span>
            <StateChip state={row.state} />
            <span className="tabular w-16 shrink-0 text-right font-semibold text-ink">
              {row.amount}
            </span>
          </div>
        ))}
      </div>
    </AppWindow>
  );
}

/** Facture et son suivi — bénéfice « Facturez sans friction ». */
export function InvoiceMockup({ className }: { className?: string }) {
  const lines = [
    ["Accompagnement — 5 jours", "3 900,00 €"],
    ["Reprise des historiques", "2 160,00 €"],
    ["Maintenance — trimestre", "870,00 €"],
  ];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[18px] border border-line/80 bg-surface shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-faint">Facture</p>
          <p className="tabular mt-1 text-[17px] font-semibold text-ink">F-2026-0148</p>
        </div>
        <div className="flex items-center gap-2">
          <StateChip state="Envoyée" />
          <PreviewTag />
        </div>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-baseline justify-between text-[12px]">
          <span className="text-faint">Client</span>
          <span className="font-medium text-ink">Delaunay &amp; Associés</span>
        </div>

        <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
          {lines.map(([label, amount]) => (
            <li key={label} className="flex items-baseline justify-between gap-4 text-[13px]">
              <span className="min-w-0 truncate text-ink-soft">{label}</span>
              <span className="tabular shrink-0 text-muted">{amount}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-muted">Total HT</dt>
            <dd className="tabular text-ink-soft">6 930,00 €</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">TVA 20 %</dt>
            <dd className="tabular text-ink-soft">1 386,00 €</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line-strong pt-3">
            <dt className="font-semibold text-ink">Total TTC</dt>
            <dd className="tabular text-[19px] font-semibold text-ink">8 316,00 €</dd>
          </div>
        </dl>
      </div>

      {/* Suivi en langage courant : aucune étape officielle n'est simulée. */}
      <div className="border-t border-line bg-canvas px-6 py-5">
        <p className="text-[12px] font-medium text-ink">Suivi</p>
        <ol className="mt-3 flex items-center">
          {[
            { label: "Créée", done: true },
            { label: "Préparée", done: true },
            { label: "Envoyée", done: true },
            { label: "Payée", done: false },
          ].map((step, index, all) => (
            <li key={step.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border-2",
                    step.done
                      ? "border-success bg-success text-white"
                      : "border-line-strong bg-surface",
                  )}
                >
                  {step.done ? <Check className="size-2.5" strokeWidth={4} /> : null}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-[10.5px]",
                    step.done ? "font-medium text-ink" : "text-faint",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < all.length - 1 ? (
                <span
                  className={cn(
                    "-mt-4 h-0.5 flex-1",
                    all[index + 1]!.done ? "bg-success/40" : "bg-line",
                  )}
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** Vue trésorerie — bénéfice « Suivez votre trésorerie ». */
export function TreasuryMockup({ className }: { className?: string }) {
  const items = [
    { client: "Delaunay & Associés", when: "Payée le 14 août", amount: eur(4680), state: "Payée" },
    { client: "Atelier Verdier", when: "Échéance dans 6 jours", amount: eur(1290), state: "Envoyée" },
    { client: "Groupe Marceau", when: "En retard de 12 jours", amount: eur(2450), state: "En retard" },
    { client: "Fonderie de l'Ouest", when: "Échéance dans 21 jours", amount: eur(5980), state: "Envoyée" },
  ];

  return (
    <AppWindow active="Paiements" className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[15px] font-semibold text-ink">Trésorerie</p>
        <p className="text-[11px] text-faint">30 derniers jours</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[10px] border border-line bg-surface px-4 py-3.5">
          <p className="text-[10.5px] uppercase tracking-[0.07em] text-faint">Encaissé</p>
          <p className="tabular mt-2 text-[22px] font-semibold tracking-[-0.02em] text-ink">
            {eur(24850)}
          </p>
        </div>
        <div className="rounded-[10px] border border-danger-border bg-danger-soft px-4 py-3.5">
          <p className="text-[10.5px] uppercase tracking-[0.07em] text-danger/70">
            En retard
          </p>
          <p className="tabular mt-2 text-[22px] font-semibold tracking-[-0.02em] text-danger">
            {eur(1350)}
          </p>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-[10px] border border-line bg-surface">
        {items.map((item, index) => (
          <div
            key={item.client}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              index > 0 && "border-t border-line",
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-medium text-ink">{item.client}</p>
              <p
                className={cn(
                  "mt-0.5 text-[10.5px]",
                  item.state === "En retard" ? "text-danger" : "text-faint",
                )}
              >
                {item.when}
              </p>
            </div>
            <StateChip state={item.state} />
            <span className="tabular w-16 shrink-0 text-right text-[12px] font-semibold text-ink">
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </AppWindow>
  );
}

/** Carte flottante « facture envoyée ». Deux au maximum sur le hero. */
export function FloatingInvoiceCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-52 items-center gap-3 rounded-[14px] border border-line-strong bg-surface px-4 py-3 shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-soft text-blue">
        <Send className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold text-ink">Facture envoyée</p>
        <p className="text-[11.5px] text-muted">Atelier Verdier</p>
      </div>
    </div>
  );
}

/** Carte flottante « paiement reçu ». */
export function FloatingPaymentCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex w-52 items-center gap-3 rounded-[14px] border border-line-strong bg-surface px-4 py-3 shadow-xl",
        className,
      )}
      aria-hidden="true"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
        <Check className="size-4" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold text-ink">Paiement reçu</p>
        <p className="tabular text-[11.5px] text-muted">{eur(4680)} — Delaunay</p>
      </div>
    </div>
  );
}

/**
 * Suivi seul, utilisé par la page Facturation électronique.
 * Conservé parce qu'il illustre une idée que les autres maquettes ne portent
 * pas : l'avancement d'une facture, sans manipulation de l'utilisateur.
 */
export function MarketingCompliancePreview({ className }: { className?: string }) {
  const steps = [
    { label: "Facture créée", done: true },
    { label: "Informations vérifiées", done: true },
    { label: "Préparée pour son traitement électronique", done: true },
    { label: "Envoyée au client", done: false },
  ];

  return (
    <div
      className={cn(
        "rounded-[18px] border border-line/80 bg-surface p-6 shadow-lg",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] font-semibold text-ink">Suivi de la facture</p>
        <PreviewTag />
      </div>
      <p className="tabular mt-1 text-[12px] text-faint">F-2026-0148</p>

      <ol className="mt-5">
        {steps.map((step, index) => (
          <li key={step.label} className="flex gap-3.5">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border-2",
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
                "pb-5 text-[13.5px]",
                step.done ? "font-medium text-ink" : "text-faint",
              )}
            >
              {step.label}
            </p>
          </li>
        ))}
      </ol>

      <p className="border-t border-line pt-4 text-[12.5px] leading-relaxed text-muted">
        Aucune manipulation de votre part : le suivi avance tout seul.
      </p>
    </div>
  );
}
