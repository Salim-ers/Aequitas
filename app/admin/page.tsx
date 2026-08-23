import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "drizzle-orm";
import { Building2, Users, Receipt, CreditCard, CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import { requirePlatformAdmin } from "@/src/auth/session";
import { getDb } from "@/src/database/client";
import { organizations } from "@/src/database/schema";
import { collectDiagnostics, type CheckLevel } from "@/src/admin/diagnostics";
import { getSandboxState } from "@/src/admin/sandbox";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat";
import { Card, CardBar, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/src/lib/utils";

export const metadata: Metadata = { title: "Vue d'ensemble" };
export const dynamic = "force-dynamic";

const LEVEL_ICON = {
  ok: { icon: CheckCircle2, className: "text-success" },
  warn: { icon: AlertTriangle, className: "text-warning" },
  off: { icon: MinusCircle, className: "text-faint" },
} satisfies Record<CheckLevel, { icon: typeof CheckCircle2; className: string }>;

export default async function AdminHomePage() {
  await requirePlatformAdmin();
  const db = getDb();

  // Compteurs plateforme : agrégats seuls, aucune donnée métier lue ici.
  const [counts] = await db
    .select({
      organizations: sql<number>`(select count(*) from organizations)`,
      users: sql<number>`(select count(*) from users)`,
      invoices: sql<number>`(select count(*) from invoices)`,
      activeSubscriptions: sql<number>`(select count(*) from subscriptions where status in ('TRIALING','ACTIVE','PAST_DUE','GRACE_PERIOD'))`,
    })
    .from(organizations)
    .limit(1);

  const groups = collectDiagnostics();
  const sandbox = await getSandboxState();
  const warnings = groups.flatMap((g) => g.checks).filter((c) => c.level === "warn");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Administration"
        description="État de l'instance, organisations hébergées et outils de test."
      />

      {warnings.length > 0 ? (
        <Alert
          tone="warning"
          title={`${warnings.length} point${warnings.length > 1 ? "s" : ""} de configuration à regarder`}
          className="mt-6"
        >
          {warnings.map((w) => w.label).join(" • ")}
        </Alert>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Organisations"
          value={String(Number(counts?.organizations ?? 0))}
          icon={<Building2 className="size-4" />}
        />
        <StatCard
          label="Utilisateurs"
          value={String(Number(counts?.users ?? 0))}
          icon={<Users className="size-4" />}
        />
        <StatCard
          label="Abonnements ouverts"
          value={String(Number(counts?.activeSubscriptions ?? 0))}
          icon={<CreditCard className="size-4" />}
        />
        <StatCard
          label="Factures"
          value={String(Number(counts?.invoices ?? 0))}
          icon={<Receipt className="size-4" />}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardBar title="Configuration de l'instance" />
          <CardContent className="pt-4">
            {/* §67 — Présence des variables, jamais leur valeur. */}
            <p className="mb-4 text-[12.5px] leading-relaxed text-faint">
              Seule la présence des variables est vérifiée. Aucune valeur de secret
              n&apos;est lue ni affichée sur cette page.
            </p>

            <div className="space-y-5">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-faint">
                    {group.title}
                  </p>
                  <ul className="mt-2 space-y-2.5">
                    {group.checks.map((check) => {
                      const { icon: Icon, className } = LEVEL_ICON[check.level];
                      return (
                        <li key={check.label} className="flex gap-2.5">
                          <Icon
                            className={cn("mt-0.5 size-4 shrink-0", className)}
                            aria-hidden="true"
                          />
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-medium text-ink">
                              {check.label}
                              <span className="sr-only">
                                {check.level === "ok"
                                  ? " : conforme"
                                  : check.level === "warn"
                                    ? " : à vérifier"
                                    : " : inactif"}
                              </span>
                            </p>
                            <p className="text-[12.5px] leading-relaxed text-muted">
                              {check.detail}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardBar title="Bac à sable" />
          <CardContent className="pt-4">
            {sandbox.exists ? (
              <>
                <p className="text-[13.5px] text-ink">
                  Jeu de test en place dans une organisation dédiée.
                </p>
                <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13px]">
                  {[
                    ["Clients", sandbox.counts.customers],
                    ["Factures", sandbox.counts.invoices],
                    ["Règlements", sandbox.counts.payments],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex justify-between gap-4">
                      <dt className="text-muted">{label}</dt>
                      <dd className="tabular font-medium text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <p className="text-[13.5px] leading-relaxed text-muted">
                Aucun jeu de test. Générez-en un pour voir le tableau de bord, les
                statuts de facture et les quotas se remplir avec des données
                cohérentes.
              </p>
            )}

            <div className="mt-5">
              <ButtonLink href="/admin/bac-a-sable" variant="secondary" className="w-full">
                Ouvrir le bac à sable
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="mt-6 text-[12.5px] leading-relaxed text-faint">
        L&apos;accès à cet espace dépend du rôle plateforme, distinct du rôle tenu dans
        une organisation.{" "}
        <Link href="/admin/journal" className="font-medium text-blue hover:underline">
          Consulter le journal d&apos;audit
        </Link>
        .
      </p>
    </div>
  );
}
