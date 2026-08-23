import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { Plus, Receipt } from "lucide-react";
import { requirePermission } from "@/src/auth/session";
import { getDb } from "@/src/database/client";
import { invoices } from "@/src/database/schema";
import { scoped } from "@/src/database/tenant";
import { Money, formatMoney } from "@/src/lib/money";
import { formatDate } from "@/src/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Vue d'ensemble", robots: { index: false } };
export const dynamic = "force-dynamic";

function startOfMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export default async function DashboardPage() {
  const context = await requirePermission("report:read");
  const db = getDb();
  const orgId = context.organizationId;
  const today = new Date().toISOString().slice(0, 10);

  const [totals] = await db
    .select({
      issuedCount: sql<number>`count(*) filter (where ${invoices.businessStatus} <> 'DRAFT')`,
      revenueHT: sql<string>`coalesce(sum(${invoices.totalHT}) filter (where ${invoices.businessStatus} <> 'DRAFT' and ${invoices.businessStatus} <> 'CANCELLED'), 0)`,
      revenueTTC: sql<string>`coalesce(sum(${invoices.totalTTC}) filter (where ${invoices.businessStatus} <> 'DRAFT' and ${invoices.businessStatus} <> 'CANCELLED'), 0)`,
      billedThisMonth: sql<string>`coalesce(sum(${invoices.totalTTC}) filter (where ${invoices.issueDate} >= ${startOfMonth()} and ${invoices.businessStatus} <> 'DRAFT'), 0)`,
      collected: sql<string>`coalesce(sum(${invoices.amountPaid}), 0)`,
      outstanding: sql<string>`coalesce(sum(${invoices.balanceDue}) filter (where ${invoices.paymentStatus} <> 'PAID'), 0)`,
      overdue: sql<string>`coalesce(sum(${invoices.balanceDue}) filter (where ${invoices.dueDate} < ${today} and ${invoices.paymentStatus} <> 'PAID'), 0)`,
    })
    .from(invoices)
    .where(scoped(invoices.organizationId, orgId, eq(invoices.kind, "INVOICE")));

  const recent = await db
    .select({
      id: invoices.id,
      number: invoices.number,
      issueDate: invoices.issueDate,
      totalTTC: invoices.totalTTC,
      businessStatus: invoices.businessStatus,
      paymentStatus: invoices.paymentStatus,
    })
    .from(invoices)
    .where(scoped(invoices.organizationId, orgId))
    .orderBy(desc(invoices.createdAt))
    .limit(8);

  const overdueCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(invoices)
    .where(
      scoped(
        invoices.organizationId,
        orgId,
        and(sql`${invoices.dueDate} < ${today}`, sql`${invoices.paymentStatus} <> 'PAID'`),
      ),
    );

  const kpis = [
    { label: "Chiffre d'affaires HT", value: Money.fromDb(totals?.revenueHT) },
    { label: "Facturé ce mois", value: Money.fromDb(totals?.billedThisMonth) },
    { label: "En attente", value: Money.fromDb(totals?.outstanding) },
    { label: "En retard", value: Money.fromDb(totals?.overdue) },
  ];

  const hasData = recent.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.75rem] tracking-[-0.01em] text-ink">
            Bonjour 👋
          </h1>
          <p className="mt-1 text-[14px] text-slate">{context.organizationName}</p>
        </div>
        <Link href="/factures/nouvelle">
          <Button>
            <Plus />
            Nouvelle facture
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-5">
              <p className="text-[12.5px] text-slate">{kpi.label}</p>
              <p className="tabular mt-2 text-[1.5rem] font-medium tracking-tight text-ink">
                {formatMoney(kpi.value.toDb())}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-[14px] font-medium text-ink">Dernières factures</h2>
            <Link href="/factures" className="text-[13px] text-petrol hover:underline">
              Tout voir
            </Link>
          </div>
          {hasData ? (
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="border-b border-line text-left">
                  <th scope="col" className="px-5 py-2.5 font-medium text-slate">Numéro</th>
                  <th scope="col" className="px-3 py-2.5 font-medium text-slate">Date</th>
                  <th scope="col" className="px-3 py-2.5 font-medium text-slate">Statut</th>
                  <th scope="col" className="px-5 py-2.5 text-right font-medium text-slate">
                    Montant TTC
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-line/60 last:border-0">
                    <td className="px-5 py-3">
                      <Link
                        href={`/factures/${invoice.id}`}
                        className="tabular text-ink hover:text-petrol"
                      >
                        {invoice.number ?? "Brouillon"}
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-slate">{formatDate(invoice.issueDate)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={invoice.paymentStatus === "PAID" ? "success" : "neutral"}>
                        {invoice.businessStatus === "DRAFT" ? "Brouillon" : "Émise"}
                      </Badge>
                    </td>
                    <td className="tabular px-5 py-3 text-right font-medium text-ink">
                      {formatMoney(invoice.totalTTC)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-5">
              <EmptyState
                icon={<Receipt className="size-7" />}
                title="Aucune facture pour le moment."
                description="Créez votre première facture avec Aequitas."
                action={
                  <Link href="/factures/nouvelle">
                    <Button>
                      <Plus />
                      Nouvelle facture
                    </Button>
                  </Link>
                }
              />
            </div>
          )}
        </Card>

        <Card>
          <div className="border-b border-line px-5 py-3.5">
            <h2 className="text-[14px] font-medium text-ink">Actions requises</h2>
          </div>
          <CardContent className="pt-4">
            {Number(overdueCount[0]?.count ?? 0) > 0 ? (
              <Link
                href="/factures?statut=retard"
                className="block rounded-[var(--radius)] border border-line p-3 hover:bg-paper-sunken"
              >
                <p className="text-[13.5px] font-medium text-ink">
                  {overdueCount[0]?.count} facture(s) en retard
                </p>
                <p className="tabular mt-1 text-[13px] text-slate">
                  {formatMoney(Money.fromDb(totals?.overdue).toDb())} à recouvrer
                </p>
              </Link>
            ) : (
              <p className="text-[13.5px] text-slate">
                Rien à traiter. Les retards et échéances proches apparaîtront ici.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
