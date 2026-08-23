"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/src/auth/session";
import { isDemoSeedEnabled } from "@/src/lib/env";
import { recordAuditEvent } from "@/src/audit/audit-log";
import { logger } from "@/src/lib/logger";
import { purgeSandbox, seedSandbox, SandboxError } from "@/src/admin/sandbox";

/**
 * Actions du bac à sable.
 *
 * Chaque action revérifie le rôle plateforme. Le garde posé dans le layout
 * ne protège que le rendu : une action serveur est un point d'entrée HTTP
 * à part entière, atteignable sans jamais afficher la page. La vérification
 * doit donc être refaite ici, et non héritée.
 *
 * Second garrot : DEMO_SEED_ENABLED. `isDemoSeedEnabled()` renvoie false dès
 * que VERCEL_ENV vaut "production", ce qui interdit structurellement toute
 * écriture de données de démonstration en production.
 */

export interface SandboxActionState {
  ok?: string;
  error?: string;
}

async function guard() {
  const admin = await requirePlatformAdmin();
  if (!isDemoSeedEnabled()) {
    throw new SandboxError(
      "Le bac à sable est désactivé. Définissez DEMO_SEED_ENABLED=true hors production.",
    );
  }
  return admin;
}

export async function seedSandboxAction(): Promise<SandboxActionState> {
  let admin;
  try {
    admin = await guard();
  } catch (error) {
    if (error instanceof SandboxError) return { error: error.message };
    throw error;
  }

  try {
    const result = await seedSandbox(admin.id);

    await recordAuditEvent({
      organizationId: result.organizationId,
      actorUserId: admin.id,
      action: "SETTINGS_CHANGED",
      entityType: "sandbox",
      entityId: result.organizationId,
      metadata: {
        operation: "sandbox_seeded",
        customers: result.customers,
        invoices: result.invoices,
        payments: result.payments,
      },
    });

    revalidatePath("/admin", "layout");
    return {
      ok: `Bac à sable généré : ${result.customers} clients, ${result.invoices} factures, ${result.payments} règlements.`,
    };
  } catch (error) {
    if (error instanceof SandboxError) return { error: error.message };
    logger.error("sandbox.seed_failed", {
      message: error instanceof Error ? error.message : "inconnu",
    });
    return { error: "La génération a échoué. Consultez les journaux du déploiement." };
  }
}

export async function purgeSandboxAction(): Promise<SandboxActionState> {
  let admin;
  try {
    admin = await guard();
  } catch (error) {
    if (error instanceof SandboxError) return { error: error.message };
    throw error;
  }

  try {
    const { deleted } = await purgeSandbox();
    if (!deleted) return { error: "Aucun bac à sable à supprimer." };

    await recordAuditEvent({
      organizationId: null,
      actorUserId: admin.id,
      action: "SETTINGS_CHANGED",
      entityType: "sandbox",
      metadata: { operation: "sandbox_purged" },
    });

    revalidatePath("/admin", "layout");
    return { ok: "Bac à sable supprimé. Aucune organisation réelle n'a été touchée." };
  } catch (error) {
    logger.error("sandbox.purge_failed", {
      message: error instanceof Error ? error.message : "inconnu",
    });
    return { error: "La suppression a échoué. Consultez les journaux du déploiement." };
  }
}
