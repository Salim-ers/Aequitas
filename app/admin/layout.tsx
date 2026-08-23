import type { Metadata } from "next";
import { requirePlatformAdmin } from "@/src/auth/session";
import { AdminNav, AdminNavMobile } from "@/components/admin/admin-nav";

/** §66 — L'espace plateforme n'est jamais indexé ni mis en cache partagé. */
export const metadata: Metadata = {
  title: { default: "Administration", template: "%s — Administration Aequitas" },
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/**
 * §98 — Le rôle plateforme est distinct du rôle organisation : être OWNER de
 * son entreprise ne donne aucun droit ici.
 *
 * Ce garde protège le rendu. Il ne protège PAS les actions serveur, qui sont
 * des points d'entrée HTTP indépendants : chacune revérifie le rôle de son
 * côté (voir app/admin/actions.ts).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requirePlatformAdmin();

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden lg:flex">
        <AdminNav userName={admin.email} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <AdminNavMobile />
        <main id="contenu" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
