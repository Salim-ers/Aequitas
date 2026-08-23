import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-[1.75rem] font-semibold tracking-[-0.025em] text-ink">
        Réinitialiser votre mot de passe
      </h1>

      {/* §58 — Pas de faux formulaire : l'envoi d'e-mails n'est pas raccordé. */}
      <Alert tone="info" title="Réinitialisation manuelle pour le moment" className="mt-6">
        L&apos;envoi automatique du lien attend le raccordement du service d&apos;e-mails.
        Écrivez à{" "}
        <a
          href="mailto:support@aequitas.fr"
          className="font-medium text-blue hover:underline"
        >
          support@aequitas.fr
        </a>{" "}
        depuis l&apos;adresse du compte : nous procédons manuellement, sous un jour ouvré.
      </Alert>

      <Link
        href="/connexion"
        className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-blue hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Retour à la connexion
      </Link>
    </div>
  );
}
