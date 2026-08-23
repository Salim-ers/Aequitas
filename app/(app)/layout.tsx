import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar
          planName={entitlements.plan.name}
          usageRatio={invoiceUsage.ratio}
          userName={context.user.name || context.user.email}
          organizationName={context.organizationName}
        />
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
