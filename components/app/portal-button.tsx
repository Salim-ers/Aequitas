"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Ouvre le portail de facturation Stripe (§14). */
export function PortalButton({ label = "Gérer mon abonnement" }: { label?: string }) {
  const [loading, setLoading] = useState(false);

  async function open() {
    setLoading(true);
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;

      if (!response.ok || !data?.url) {
        toast.error(data?.error ?? "Le portail de facturation n'a pas pu s'ouvrir.");
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Le portail de facturation n'a pas pu s'ouvrir. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="secondary" disabled={loading} onClick={() => void open()}>
      {loading ? "Ouverture…" : label}
    </Button>
  );
}
