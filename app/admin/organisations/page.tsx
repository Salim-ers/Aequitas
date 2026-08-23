import type { Metadata } from "next";
import { desc, eq, sql } from "drizzle-orm";
import { requirePlatformAdmin } from "@/src/auth/session";
import { getDb } from "@/src/database/client";
import { organizations, subscriptions } from "@/src/database/schema";
import { SANDBOX_MARKER } from "@/src/admin/sandbox";
import { getPlan } from "@/src/config/plans";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableScroll, Th, Td, Tr } from "@/components/ui/table";
import { formatDate } from "@/src/lib/utils";
import { Building2 } from "lucide-react";

export const metadata: Metadata = { title: "Organisations" };
export const dynamic = "force-dynamic";

/**
 * Vue plateforme, strictement en lecture.
 *
 * Aucune donnée métier n'est affichée — ni facture, ni client, ni montant.
 * Un administrateur plateforme voit qui est hébergé et dans quel état
 * d'abonnement, pas le contenu commercial de ses clients.
 */
const STATUS_TONE: Record<string, BadgeTone> = {
  ACTIVE: "success",
  TRIALING: "blue",
  PAST_DUE: "warning",
  GRACE_PERIOD: "warning",
  INCOMPLETE: "neutral",
  INCOMPLETE_EXPIRED: "neutral",
  CANCELED: "neutral",
  SUSPENDED: "danger",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Actif",
  TRIALING: "Essai",
  PAST_DUE: "Paiement en attente",
  GRACE_PERIOD: "Tolérance",
  INCOMPLETE: "À activer",
  INCOMPLETE_EXPIRED: "Expiré",
  CANCELED: "Résilié",
  SUSPENDED: "Suspendu",
};

export default async function AdminOrganizationsPage() {
  await requirePlatformAdmin();
  const db = getDb();

  const rows = await db
    .select({
      id: organizations.id,
      legalName: organizations.legalName,
      slug: organizations.slug,
      siren: organizations.siren,
      city: organizations.city,
      createdAt: organizations.createdAt,
      onboardingStep: organizations.onboardingStep,
      onboardingCompletedAt: organizations.onboardingCompletedAt,
      plan: subscriptions.plan,
      status: subscriptions.status,
      members: sql<number>`(select count(*) from memberships where memberships.organization_id = ${organizations.id})`,
    })
    .from(organizations)
    .leftJoin(subscriptions, eq(subscriptions.organizationId, organizations.id))
    .orderBy(desc(organizations.createdAt))
    .limit(200);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Organisations"
        description="Qui est hébergé sur cette instance, et dans quel état d'abonnement. Aucune donnée commerciale n'est exposée ici."
      />

      <Card className="mt-6 overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState
            icon={<Building2 className="size-5" />}
            title="Aucune organisation."
            description="Les entreprises apparaîtront ici dès la première inscription."
            className="border-0"
          />
        ) : (
          <TableScroll>
            <Table>
              <caption className="sr-only">
                Organisations hébergées, de la plus récente à la plus ancienne
              </caption>
              <thead>
                <tr>
                  <Th>Entreprise</Th>
                  <Th>SIREN</Th>
                  <Th>Offre</Th>
                  <Th>Abonnement</Th>
                  <Th numeric>Membres</Th>
                  <Th>Créée le</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const status = row.status ?? "INCOMPLETE";
                  const isSandbox = row.onboardingStep === SANDBOX_MARKER;
                  return (
                    <Tr key={row.id}>
                      <Td>
                        <span className="font-medium text-ink">{row.legalName}</span>
                        {isSandbox ? (
                          <Badge tone="warning" className="ml-2 align-middle">
                            Bac à sable
                          </Badge>
                        ) : null}
                        {row.city ? (
                          <span className="block text-[12.5px] text-faint">{row.city}</span>
                        ) : null}
                      </Td>
                      <Td className="tabular text-muted">{row.siren ?? "—"}</Td>
                      <Td className="text-muted">
                        {row.plan ? getPlan(row.plan).name : "—"}
                      </Td>
                      <Td>
                        <Badge tone={STATUS_TONE[status] ?? "neutral"} dot>
                          {STATUS_LABEL[status] ?? status}
                        </Badge>
                      </Td>
                      <Td numeric>{Number(row.members ?? 0)}</Td>
                      <Td className="text-muted">{formatDate(row.createdAt)}</Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Card>

      {rows.length >= 200 ? (
        <p className="mt-4 text-[12.5px] text-faint">
          Affichage limité aux 200 organisations les plus récentes.
        </p>
      ) : null}
    </div>
  );
}
