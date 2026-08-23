import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { resolveOrganizationContext } from "@/src/auth/session";
import { checkLimit, getEntitlements } from "@/src/billing/entitlements";

export const dynamic = "force-dynamic";

/** §104 — Aucune donnée d'organisation ne doit être mise en cache partagé. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const context = await resolveOrganizationContext();
  if (!context) redirect("/onboarding");

  const [entitlements, invoiceUsage] = await Promise.all([
    getEntitlements(context.organizationId),
    checkLimit(context.organizationId, "invoices_per_month"),
  ]);

  const nav = {
    planName: entitlements.plan.name,
    usageRatio: invoiceUsage.ratio,
    invoiceUsed: invoiceUsage.used,
    invoiceLimit: invoiceUsage.limit,
    userName: context.user.name || context.user.email,
    organizationName: context.organizationName,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <div className="hidden lg:flex">
        <Sidebar {...nav} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Topbar {...nav} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
