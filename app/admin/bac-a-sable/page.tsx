import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { requirePlatformAdmin } from "@/src/auth/session";
import { isDemoSeedEnabled } from "@/src/lib/env";
import { getSandboxState } from "@/src/admin/sandbox";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBar, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { SandboxControls } from "@/components/admin/sandbox-controls";
import { formatDateTime } from "@/src/lib/utils";

export const metadata: Metadata = { title: "Bac à sable" };
export const dynamic = "force-dynamic";

const CONTENT = [
  ["6 clients", "Sociétés françaises avec SIREN et délais de règlement variés."],
  ["5 articles", "Prestations aux taux de TVA 20 % et 10 %."],
  ["24 factures", "Réparties sur douze mois, avec remises de ligne."],
  ["5 situations", "Brouillon, envoyée, payée, partiellement payée, en retard."],
  ["Règlements", "Virements affectés à leur facture, soldes recalculés."],
];

export default async function SandboxPage() {
  await requirePlatformAdmin();
  const enabled = isDemoSeedEnabled();
  const state = enabled ? await getSandboxState() : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        title="Bac à sable"
        description="Un jeu de données réaliste dans une organisation dédiée et jetable, pour éprouver l'application de bout en bout."
      />

      <Alert tone="info" title="Les données passent par le domaine réel" className="mt-6">
        Les montants sont calculés par le moteur de TVA, l&apos;arithmétique par
        l&apos;abstraction monétaire et les numéros par la séquence
        transactionnelle. Le jeu de test exerce donc le code de production, pas une
        imitation — c&apos;est ce qui rend l&apos;exercice concluant.
      </Alert>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardBar title="Contenu généré" />
          <CardContent className="pt-4">
            <dl className="space-y-3">
              {CONTENT.map(([term, detail]) => (
                <div key={term}>
                  <dt className="text-[13.5px] font-semibold text-ink">{term}</dt>
                  <dd className="mt-0.5 text-[12.5px] leading-relaxed text-muted">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 border-t border-line pt-3 text-[12.5px] leading-relaxed text-faint">
              Le tirage est déterministe : deux générations produisent le même jeu, donc
              un écart constaté vient du code et non du hasard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardBar title="État actuel" />
          <CardContent className="pt-4">
            {state?.exists ? (
              <>
                <p className="text-[14px] font-medium text-ink">{state.legalName}</p>
                <p className="mt-0.5 text-[12.5px] text-faint">
                  Créé le {formatDateTime(state.createdAt)}
                </p>
                <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[13.5px]">
                  {[
                    ["Clients", state.counts.customers],
                    ["Factures", state.counts.invoices],
                    ["Règlements", state.counts.payments],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="flex justify-between gap-4">
                      <dt className="text-muted">{label}</dt>
                      <dd className="tabular font-medium text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 border-t border-line pt-3 text-[12.5px] leading-relaxed text-muted">
                  Vous êtes membre OWNER de cette organisation : votre espace bascule
                  dessus si c&apos;est votre seule adhésion active.
                </p>
              </>
            ) : (
              <EmptyState
                icon={<FlaskConical className="size-5" />}
                title="Aucun jeu de test."
                description="Générez-en un pour remplir le tableau de bord, les statuts de facture et les quotas."
                className="border-0 py-8"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <SandboxControls exists={Boolean(state?.exists)} enabled={enabled} />
      </div>

      <p className="mt-8 border-t border-line pt-5 text-[12.5px] leading-relaxed text-faint">
        La suppression ne peut atteindre qu&apos;une organisation portant à la fois le
        slug et le marqueur du bac à sable. Aucune organisation réelle n&apos;est
        accessible à cette opération, quel que soit l&apos;identifiant transmis.
      </p>
    </div>
  );
}
