"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input, Label } from "@/components/ui/input";
import { seedSandboxAction, purgeSandboxAction } from "@/app/admin/actions";

const CONFIRM_WORD = "SUPPRIMER";

/**
 * §47 — La génération part sans cérémonie ; la suppression, elle, demande
 * une confirmation saisie. Elle détruit des lignes en base et n'est pas
 * réversible.
 */
export function SandboxControls({
  exists,
  enabled,
}: {
  exists: boolean;
  enabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok?: string; error?: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  function run(action: () => Promise<{ ok?: string; error?: string }>) {
    setFeedback(null);
    startTransition(async () => {
      const result = await action();
      setFeedback(result);
      setConfirming(false);
      setConfirmText("");
      router.refresh();
    });
  }

  if (!enabled) {
    return (
      <Alert tone="warning" title="Bac à sable désactivé">
        Définissez <code className="font-mono">DEMO_SEED_ENABLED=true</code> dans les
        variables d&apos;environnement de l&apos;instance. Le drapeau est ignoré lorsque
        <code className="ml-1 font-mono">VERCEL_ENV</code> vaut « production » : aucune
        donnée de démonstration ne peut y être écrite.
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {feedback?.ok ? <Alert tone="success">{feedback.ok}</Alert> : null}
      {feedback?.error ? <Alert tone="critical">{feedback.error}</Alert> : null}

      {!exists ? (
        <Button
          size="lg"
          disabled={pending}
          onClick={() => run(seedSandboxAction)}
        >
          {pending ? "Génération en cours…" : "Générer le jeu de test"}
        </Button>
      ) : !confirming ? (
        <div className="flex flex-wrap gap-3">
          <Button variant="danger" disabled={pending} onClick={() => setConfirming(true)}>
            Supprimer le bac à sable
          </Button>
        </div>
      ) : (
        <div className="rounded-[var(--radius-lg)] border border-danger-border bg-danger-soft p-5">
          <p className="text-[14px] font-semibold text-danger">
            Supprimer définitivement le bac à sable ?
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
            Clients, factures, lignes et règlements de cette organisation seront
            détruits. Cette action est irréversible. Aucune autre organisation
            n&apos;est concernée.
          </p>

          <div className="mt-4 max-w-xs">
            <Label htmlFor="confirmation">
              Saisissez <span className="font-mono font-semibold">{CONFIRM_WORD}</span> pour
              confirmer
            </Label>
            <Input
              id="confirmation"
              value={confirmText}
              autoComplete="off"
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => {
                setConfirming(false);
                setConfirmText("");
              }}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              disabled={pending || confirmText !== CONFIRM_WORD}
              onClick={() => run(purgeSandboxAction)}
            >
              {pending ? "Suppression…" : "Supprimer définitivement"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
