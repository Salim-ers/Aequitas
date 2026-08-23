import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { ScrollText } from "lucide-react";
import { requirePlatformAdmin } from "@/src/auth/session";
import { getDb } from "@/src/database/client";
import { auditEvents, organizations, users } from "@/src/database/schema";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableScroll, Th, Td, Tr } from "@/components/ui/table";
import { formatDateTime } from "@/src/lib/utils";

export const metadata: Metadata = { title: "Journal d'audit" };
export const dynamic = "force-dynamic";

/**
 * §45 — Le journal est en ajout seul : cette page ne fait que lire.
 * Les métadonnées sont déjà expurgées à l'écriture (secrets, IBAN, XML, PDF).
 */
const ACTION_LABEL: Record<string, string> = {
  LOGIN: "Connexion",
  LOGOUT: "Déconnexion",
  USER_INVITED: "Utilisateur invité",
  ROLE_CHANGED: "Rôle modifié",
  MEMBER_REMOVED: "Membre retiré",
  CUSTOMER_CREATED: "Client créé",
  CUSTOMER_UPDATED: "Client modifié",
  CUSTOMER_DELETED: "Client supprimé",
  SUPPLIER_CREATED: "Fournisseur créé",
  PRODUCT_CREATED: "Article créé",
  QUOTE_CREATED: "Devis créé",
  QUOTE_SENT: "Devis envoyé",
  QUOTE_CONVERTED: "Devis converti",
  INVOICE_CREATED: "Facture créée",
  INVOICE_FINALIZED: "Facture finalisée",
  INVOICE_SENT: "Facture envoyée",
  INVOICE_DOWNLOADED: "Facture téléchargée",
  INVOICE_CANCELLED: "Facture annulée",
  CREDIT_NOTE_CREATED: "Avoir créé",
  PAYMENT_CREATED: "Règlement enregistré",
  SUBSCRIPTION_CHANGED: "Abonnement modifié",
  API_KEY_CREATED: "Clé API créée",
  API_KEY_REVOKED: "Clé API révoquée",
  WEBHOOK_CREATED: "Webhook créé",
  SETTINGS_CHANGED: "Paramètres modifiés",
  EXPORT_REQUESTED: "Export demandé",
  TRANSMISSION_REQUESTED: "Transmission demandée",
};

export default async function AdminAuditPage() {
  await requirePlatformAdmin();
  const db = getDb();

  const rows = await db
    .select({
      id: auditEvents.id,
      action: auditEvents.action,
      actorType: auditEvents.actorType,
      entityType: auditEvents.entityType,
      occurredAt: auditEvents.occurredAt,
      metadata: auditEvents.metadata,
      organizationName: organizations.legalName,
      actorEmail: users.email,
    })
    .from(auditEvents)
    .leftJoin(organizations, eq(organizations.id, auditEvents.organizationId))
    .leftJoin(users, eq(users.id, auditEvents.actorUserId))
    .orderBy(desc(auditEvents.occurredAt))
    .limit(100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Journal d'audit"
        description="Les cent dernières actions sensibles, toutes organisations confondues. Le journal est en ajout seul : rien ne peut y être modifié ni supprimé."
      />

      <Card className="mt-6 overflow-hidden">
        {rows.length === 0 ? (
          <EmptyState
            icon={<ScrollText className="size-5" />}
            title="Aucun événement enregistré."
            description="Les actions sensibles apparaîtront ici au fil de l'utilisation."
            className="border-0"
          />
        ) : (
          <TableScroll>
            <Table>
              <caption className="sr-only">
                Journal d&apos;audit, de l&apos;événement le plus récent au plus ancien
              </caption>
              <thead>
                <tr>
                  <Th>Quand</Th>
                  <Th>Action</Th>
                  <Th>Auteur</Th>
                  <Th>Organisation</Th>
                  <Th>Détail</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <Tr key={row.id}>
                    <Td className="tabular whitespace-nowrap text-muted">
                      {formatDateTime(row.occurredAt)}
                    </Td>
                    <Td>
                      <span className="font-medium text-ink">
                        {ACTION_LABEL[row.action] ?? row.action}
                      </span>
                    </Td>
                    <Td className="text-muted">
                      {row.actorType === "SYSTEM" ? (
                        <Badge tone="neutral">Système</Badge>
                      ) : (
                        (row.actorEmail ?? "—")
                      )}
                    </Td>
                    <Td className="text-muted">{row.organizationName ?? "—"}</Td>
                    <Td className="text-muted">
                      <span className="line-clamp-1 max-w-[18rem] font-mono text-[12px]">
                        {summarize(row.metadata)}
                      </span>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableScroll>
        )}
      </Card>
    </div>
  );
}

/** Rend les métadonnées lisibles sur une ligne, sans les reformater. */
function summarize(metadata: Record<string, unknown> | null): string {
  if (!metadata) return "—";
  const entries = Object.entries(metadata);
  if (entries.length === 0) return "—";
  return entries
    .slice(0, 4)
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(" ");
}
