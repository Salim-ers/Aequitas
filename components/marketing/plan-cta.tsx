"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { PlanSlug } from "@/src/config/plans";

/**
 * Bouton de souscription.
 * Si l'utilisateur n'est pas connecté, l'API renvoie une redirection :
 * on l'envoie vers l'inscription en conservant l'offre choisie.
 */
export function PlanCta({
  plan,
  label,
  highlighted,
}: {
  plan: PlanSlug | "enterprise";
  label: string;
  highlighted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  if (plan === "enterprise") {
    return (
      <Button
        variant={highlighted ? "primary" : "secondary"}
        className="w-full"
        onClick={() => router.push("/contact?sujet=enterprise")}
      >
        {label}
      </Button>
    );
  }

  async function subscribe() {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, period: "monthly" }),
      });

      if (response.status === 401 || response.redirected) {
        startTransition(() => router.push(`/inscription?offre=${plan}`));
        return;
      }

      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        toast.error(data.error ?? "La souscription n'a pas pu démarrer.");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("La souscription n'a pas pu démarrer. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={highlighted ? "primary" : "secondary"}
      className="w-full"
      disabled={loading || isPending}
      onClick={() => void subscribe()}
    >
      {loading ? "Ouverture du paiement…" : label}
    </Button>
  );
}
