"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Attente active de l'activation.
 * On interroge le serveur ; on ne se fie jamais au simple retour de Stripe.
 */
export function SubscriptionActivation({ planName }: { planName: string }) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((value) => value + 3);
      router.refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const slow = elapsed >= 30;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 text-center">
      <div
        className="mx-auto size-8 animate-spin rounded-full border-2 border-line-strong border-t-petrol"
        role="status"
        aria-label="Activation en cours"
      />
      <h1 className="mt-6 font-display text-[1.5rem] tracking-[-0.01em] text-ink">
        Activation de votre abonnement…
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-slate">
        Nous attendons la confirmation de Stripe pour l&apos;offre {planName}. Cela prend
        généralement quelques secondes.
      </p>

      {slow ? (
        <div className="mt-8 rounded-[var(--radius)] border border-line bg-paper-sunken p-4 text-left">
          <p className="text-[13.5px] text-ink-soft">
            La confirmation tarde. Votre paiement n&apos;est pas perdu : l&apos;abonnement
            s&apos;activera dès réception. Vous pouvez fermer cette page.
          </p>
          <Link href="/abonnement" className="mt-3 inline-block">
            <Button variant="secondary" size="sm">
              Voir mon abonnement
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
