/** §40 / §97 — Matrice de permissions évaluée exclusivement côté serveur. */

export type OrganizationRole =
  | "OWNER"
  | "ADMIN"
  | "ACCOUNTANT"
  | "BILLING"
  | "SALES"
  | "READ_ONLY";

export type Permission =
  | "organization:read"
  | "organization:update"
  | "organization:delete"
  | "member:read"
  | "member:invite"
  | "member:update_role"
  | "member:remove"
  | "customer:read"
  | "customer:write"
  | "supplier:read"
  | "supplier:write"
  | "product:read"
  | "product:write"
  | "quote:read"
  | "quote:write"
  | "invoice:read"
  | "invoice:write"
  | "invoice:finalize"
  | "invoice:cancel"
  | "payment:read"
  | "payment:write"
  | "purchase:read"
  | "purchase:write"
  | "report:read"
  | "audit:read"
  | "apikey:read"
  | "apikey:write"
  | "webhook:read"
  | "webhook:write"
  | "subscription:read"
  | "subscription:manage"
  | "settings:read"
  | "settings:write"
  | "electronic:read"
  | "electronic:transmit";

const ALL: Permission[] = [
  "organization:read", "organization:update", "organization:delete",
  "member:read", "member:invite", "member:update_role", "member:remove",
  "customer:read", "customer:write",
  "supplier:read", "supplier:write",
  "product:read", "product:write",
  "quote:read", "quote:write",
  "invoice:read", "invoice:write", "invoice:finalize", "invoice:cancel",
  "payment:read", "payment:write",
  "purchase:read", "purchase:write",
  "report:read", "audit:read",
  "apikey:read", "apikey:write",
  "webhook:read", "webhook:write",
  "subscription:read", "subscription:manage",
  "settings:read", "settings:write",
  "electronic:read", "electronic:transmit",
];

const READ_ONLY_PERMISSIONS: Permission[] = [
  "organization:read", "member:read", "customer:read", "supplier:read",
  "product:read", "quote:read", "invoice:read", "payment:read",
  "purchase:read", "report:read", "settings:read", "electronic:read",
];

export const ROLE_PERMISSIONS: Readonly<Record<OrganizationRole, readonly Permission[]>> = {
  OWNER: ALL,
  ADMIN: ALL.filter((p) => p !== "organization:delete"),
  ACCOUNTANT: [
    ...READ_ONLY_PERMISSIONS,
    "invoice:write", "invoice:finalize", "payment:write",
    "purchase:write", "audit:read", "electronic:transmit",
  ],
  BILLING: [
    ...READ_ONLY_PERMISSIONS,
    "invoice:write", "invoice:finalize", "payment:write",
    "subscription:read", "subscription:manage",
  ],
  SALES: [
    ...READ_ONLY_PERMISSIONS,
    "customer:write", "product:write", "quote:write", "invoice:write",
  ],
  READ_ONLY: READ_ONLY_PERMISSIONS,
};

export function roleHasPermission(role: OrganizationRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export const ROLE_LABELS: Readonly<Record<OrganizationRole, string>> = {
  OWNER: "Propriétaire",
  ADMIN: "Administrateur",
  ACCOUNTANT: "Comptabilité",
  BILLING: "Facturation",
  SALES: "Commercial",
  READ_ONLY: "Lecture seule",
};
