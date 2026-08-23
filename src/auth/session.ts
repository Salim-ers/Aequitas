import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getAuth } from "./server";
import { getDb } from "@/src/database/client";
import { memberships, organizations } from "@/src/database/schema";
import {
  roleHasPermission,
  type OrganizationRole,
  type Permission,
} from "@/src/permissions/roles";

/**
 * §97 — API interne centralisée : toute route métier passe par ici.
 * On ne fait jamais confiance à un organizationId envoyé par le client.
 */

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  platformRole: "USER" | "SUPPORT" | "ADMIN" | "SUPER_ADMIN";
}

export interface OrganizationContext {
  user: AuthenticatedUser;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: OrganizationRole;
  onboardingCompleted: boolean;
}

export class UnauthorizedError extends Error {
  constructor(message = "Authentification requise") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Permission insuffisante") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const u = session.user as unknown as Record<string, unknown>;
  return {
    id: String(u.id),
    email: String(u.email),
    name: String(u.name ?? ""),
    emailVerified: Boolean(u.emailVerified),
    platformRole: (u.platformRole as AuthenticatedUser["platformRole"]) ?? "USER",
  };
});

export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return user;
}

/**
 * Résout l'organisation active de l'utilisateur à partir de ses adhésions.
 * Un `organizationId` explicite n'est accepté que si l'utilisateur y adhère.
 */
export const resolveOrganizationContext = cache(
  async (requestedOrganizationId?: string): Promise<OrganizationContext | null> => {
    const user = await getCurrentUser();
    if (!user) return null;

    const db = getDb();
    const rows = await db
      .select({
        organizationId: memberships.organizationId,
        role: memberships.role,
        status: memberships.status,
        name: organizations.legalName,
        slug: organizations.slug,
        onboardingCompletedAt: organizations.onboardingCompletedAt,
      })
      .from(memberships)
      .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
      .where(
        requestedOrganizationId
          ? and(
              eq(memberships.userId, user.id),
              eq(memberships.organizationId, requestedOrganizationId),
            )
          : eq(memberships.userId, user.id),
      )
      .limit(requestedOrganizationId ? 1 : 50);

    const active = rows.find((r) => r.status === "ACTIVE");
    if (!active) return null;

    return {
      user,
      organizationId: active.organizationId,
      organizationName: active.name,
      organizationSlug: active.slug,
      role: active.role as OrganizationRole,
      onboardingCompleted: active.onboardingCompletedAt !== null,
    };
  },
);

export async function requireOrganization(): Promise<OrganizationContext> {
  const user = await requireUser();
  const context = await resolveOrganizationContext();
  if (!context) {
    // L'utilisateur est authentifié mais n'a pas encore d'entreprise.
    void user;
    redirect("/onboarding");
  }
  return context;
}

/** Garde principale : session + adhésion + permission, en une seule vérification. */
export async function requirePermission(
  permission: Permission,
): Promise<OrganizationContext> {
  const context = await requireOrganization();
  if (!roleHasPermission(context.role, permission)) {
    throw new ForbiddenError(
      `Votre rôle (${context.role}) ne permet pas l'action « ${permission} »`,
    );
  }
  return context;
}

export async function requirePlatformAdmin(): Promise<AuthenticatedUser> {
  const user = await requireUser();
  if (user.platformRole !== "ADMIN" && user.platformRole !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }
  return user;
}
