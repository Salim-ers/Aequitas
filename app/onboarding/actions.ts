"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/src/database/client";
import {
  memberships,
  organizationSettings,
  organizations,
  subscriptions,
} from "@/src/database/schema";
import { requireUser } from "@/src/auth/session";
import { recordAuditEvent } from "@/src/audit/audit-log";
import { incrementUsage } from "@/src/billing/entitlements";

/** §21 — Étape 1 de l'onboarding : création de l'entreprise. */

const companySchema = z.object({
  legalName: z.string().min(2, "Raison sociale requise").max(200),
  legalForm: z.string().max(60).optional().or(z.literal("")),
  siren: z
    .string()
    .regex(/^\d{9}$/, "Le SIREN comporte 9 chiffres")
    .optional()
    .or(z.literal("")),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le SIRET comporte 14 chiffres")
    .optional()
    .or(z.literal("")),
  vatNumber: z.string().max(20).optional().or(z.literal("")),
  addressLine1: z.string().max(200).optional().or(z.literal("")),
  postalCode: z.string().max(10).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
});

export interface OnboardingState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function createOrganizationAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const user = await requireUser();

  const parsed = companySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Vérifiez les champs signalés.", fieldErrors };
  }

  const data = parsed.data;
  const db = getDb();

  // Slug unique : on suffixe tant qu'il est pris.
  const base = slugify(data.legalName) || "entreprise";
  let slug = base;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const [existing] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1);
    if (!existing) break;
    slug = `${base}-${attempt}`;
  }

  const organizationId = await db.transaction(async (tx) => {
    const [org] = await tx
      .insert(organizations)
      .values({
        slug,
        legalName: data.legalName,
        legalForm: data.legalForm || null,
        siren: data.siren || null,
        siret: data.siret || null,
        vatNumber: data.vatNumber || null,
        addressLine1: data.addressLine1 || null,
        postalCode: data.postalCode || null,
        city: data.city || null,
        country: "FR",
        email: user.email,
        onboardingStep: "billing",
      })
      .returning({ id: organizations.id });

    if (!org) throw new Error("Création de l'entreprise impossible");

    await tx.insert(memberships).values({
      organizationId: org.id,
      userId: user.id,
      role: "OWNER",
      status: "ACTIVE",
    });

    await tx.insert(organizationSettings).values({ organizationId: org.id });

    // §17 — l'abonnement naît INCOMPLETE : seul le webhook Stripe l'activera.
    await tx.insert(subscriptions).values({
      organizationId: org.id,
      plan: "essentiel",
      status: "INCOMPLETE",
    });

    return org.id;
  });

  await incrementUsage(organizationId, "organizations", 1);
  await incrementUsage(organizationId, "users", 1);

  await recordAuditEvent({
    organizationId,
    actorUserId: user.id,
    action: "SETTINGS_CHANGED",
    entityType: "organization",
    entityId: organizationId,
    metadata: { step: "company_created" },
  });

  redirect("/onboarding/abonnement");
}
