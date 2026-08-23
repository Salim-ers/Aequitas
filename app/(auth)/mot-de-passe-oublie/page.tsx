import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="font-display text-[1.75rem] tracking-[-0.01em] text-ink">
        Réinitialiser votre mot de passe
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-slate">
        L&apos;envoi du lien de réinitialisation attend le raccordement du service
        d&apos;emails transactionnels. En attendant, écrivez à support@aequitas.fr depuis
        l&apos;adresse du compte et nous procédons manuellement.
      </p>
      <Link
        href="/connexion"
        className="mt-6 inline-block text-[13.5px] text-petrol hover:underline"
      >
        Retour à la connexion
      </Link>
    </div>
  );
}
