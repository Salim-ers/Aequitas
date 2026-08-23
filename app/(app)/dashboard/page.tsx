import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  Receipt,
  TrendingUp,
  Clock,
  AlertTriangle,
  FileCheck2,
  ArrowRight,
} from "lucide-react";
import { requirePermission } from "@/src/auth/session";
import { getDb } from "@/src/database/client";
import { invoices } from "@/src/database/schema";
import { scoped } from "@/src/database/tenant";
import { Money, formatMoney } from "@/src/lib/money";
import { formatDate } from "@/src/lib/utils";
import { Card, CardBar, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableScroll, Th, Td, Tr } from "@/components/ui/table";

export const metadata: Metadata = { title: "Vue d'ensemble", robots: { index: false } };
export const dynamic = "force-dynamic";

function startOfMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

/**
 * §9 — Traduction des statuts stockés en libellés compréhensibles.
 * Le retard prime sur tout le reste : c'est ce qui appelle une action.
 */
function readableStatus(invoice: {
  businessStatus: string;
  paymentStatus: string;
  dueDate: string | null;
}): string {
  if (invoice.businessStatus === "DRAFT") return "draft";
  if (invoice.businessStatus === "CANCELLED") return "cancelled";
  if (invoice.paymentStatus === "PAID") return "paid";
  const today = new Date().toISOString().slice(0, 10);
  if (invoice.dueDate && invoice.dueDate < today) return "overdue";
  return "sent";
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
      dueDate: invoices.dueDate,
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

  const draftCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(invoices)
    .where(scoped(invoices.organizationId, orgId, eq(invoices.businessStatus, "DRAFT")));

  const overdue = Number(overdueCount[0]?.count ?? 0);
  const drafts = Number(draftCount[0]?.count ?? 0);
  const hasData = recent.length > 0;

  // §19 — Ce qui appelle une action passe avant les indicateurs.
  const actions = [
    overdue > 0
      ? {
          key: "overdue",
          icon: AlertTriangle,
          tone: "danger" as const,
          label: `${overdue} facture${overdue > 1 ? "s" : ""} en retard`,
          detail: `${formatMoney(Money.fromDb(totals?.overdue).toDb())} à recouvrer`,
        }
      : null,
    drafts > 0
      ? {
          key: "drafts",
          icon: FileCheck2,
          tone: "warning" as const,
          label: `${drafts} brouillon${drafts > 1 ? "s" : ""} à finaliser`,
          detail: "Ces factures ne sont pas encore émises.",
        }
      : null,
  ].filter((item) => item !== null);

  const kpis = [
    {
      label: "Encaissé",
      value: Money.fromDb(totals?.collected),
      icon: <TrendingUp className="size-4" />,
      tone: "success" as const,
      hint: "Depuis l'origine",
    },
    {
      label: "Facturé ce mois",
      value: Money.fromDb(totals?.billedThisMonth),
      icon: <Receipt className="size-4" />,
      tone: "neutral" as const,
      hint: "Toutes factures émises",
    },
    {
      label: "En attente",
      value: Money.fromDb(totals?.outstanding),
      icon: <Clock className="size-4" />,
      tone: "neutral" as const,
      hint: "Reste à encaisser",
    },
    {
      label: "En retard",
      value: Money.fromDb(totals?.overdue),
      icon: <AlertTriangle className="size-4" />,
      tone: overdue > 0 ? ("danger" as const) : ("neutral" as const),
      hint: overdue > 0 ? `${overdue} facture${overdue > 1 ? "s" : ""}` : "Rien en retard",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.75rem]">
          Bonjour {firstName(context.user.name || context.user.email)},
        </h1>
        <p className="mt-1.5 text-[14.5px] text-muted">
          {actions.length > 0
            ? "Voici ce qui nécessite votre attention aujourd'hui."
            : `Voici l'activité de ${context.organizationName}.`}
        </p>
      </div>

      {actions.length > 0 ? (
        <ul className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
          {actions.map((action, index) => (
            <li
              key={action.key}
              className={index > 0 ? "border-t border-line" : undefined}
            >
              <div className="flex items-center gap-3 px-5 py-3.5">
                <span
                  className={
                    action.tone === "danger"
                      ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger"
                      : "flex size-8 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning"
                  }
                >
                  <action.icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-ink">{action.label}</p>
                  <p className="tabular text-[13px] text-muted">{action.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={formatMoney(kpi.value.toDb())}
            icon={kpi.icon}
            tone={kpi.tone}
            hint={kpi.hint}
          />
        ))}
      </div>

      <Card className="mt-6">
        <CardBar
          title="Dernières factures"
          action={
            <span className="tabular text-[13px] text-faint">
              {Number(totals?.issuedCount ?? 0)} émise
              {Number(totals?.issuedCount ?? 0) > 1 ? "s" : ""} au total
            </span>
          }
        />

        {hasData ? (
          <TableScroll>
            <Table>
              <caption className="sr-only">
                Les huit dernières factures créées, de la plus récente à la plus ancienne
              </caption>
              <thead>
                <tr>
                  <Th>Numéro</Th>
                  <Th>Date</Th>
                  <Th>Échéance</Th>
                  <Th>Statut</Th>
                  <Th numeric>Montant TTC</Th>
                </tr>
              </thead>
              <tbody>
                {recent.map((invoice) => (
                  <Tr key={invoice.id}>
                    <Td className="tabular font-medium text-ink">
                      {invoice.number ?? "—"}
                    </Td>
                    <Td className="text-muted">{formatDate(invoice.issueDate)}</Td>
                    <Td className="text-muted">{formatDate(invoice.dueDate)}</Td>
                    <Td>
                      <StatusBadge status={readableStatus(invoice)} />
                    </Td>
                    <Td numeric>{formatMoney(invoice.totalTTC)}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        ) : (
          <CardContent className="pt-2">
            {/* §58 — Aucun bouton ne promet une création de facture inexistante. */}
            <EmptyState
              icon={<Receipt className="size-5" />}
              title="Aucune facture pour le moment."
              description="Dès que vos premières factures existeront, vous les retrouverez ici avec leur statut et leur échéance."
            />
          </CardContent>
        )}
      </Card>

      <p className="mt-6 text-[13px] leading-relaxed text-faint">
        Les modules Factures, Devis et Clients sont en cours d&apos;activation.{" "}
        <Link href="/contact" className="font-medium text-blue hover:underline">
          Être prévenu de leur ouverture
          <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
        </Link>
      </p>
    </div>
  );
}

function firstName(value: string): string {
  const name = value.split("@")[0] ?? value;
  const first = name.trim().split(/[\s._-]+/)[0] ?? name;
  return first.charAt(0).toUpperCase() + first.slice(1);
}
