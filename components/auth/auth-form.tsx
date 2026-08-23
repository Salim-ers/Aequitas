"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { authClient } from "@/src/auth/client";

type Mode = "signin" | "signup";

const MIN_PASSWORD = 12;

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPasswordError(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "").trim();

    if (isSignup && password.length < MIN_PASSWORD) {
      setPasswordError(`Choisissez un mot de passe d'au moins ${MIN_PASSWORD} caractères.`);
      setLoading(false);
      return;
    }

    try {
      const result = isSignup
        ? await authClient.signUp.email({ email, password, name })
        : await authClient.signIn.email({ email, password });

      if (result.error) {
        setError(
          isSignup
            ? "Ce compte n'a pas pu être créé. Vérifiez l'adresse e-mail et réessayez."
            : "Adresse e-mail ou mot de passe incorrect.",
        );
        return;
      }

      toast.success(isSignup ? "Compte créé" : "Connecté");
      const plan = searchParams.get("offre");
      router.push(isSignup ? `/onboarding${plan ? `?offre=${plan}` : ""}` : "/dashboard");
      router.refresh();
    } catch {
      setError("Le service d'authentification est momentanément indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-[1.75rem] font-semibold tracking-[-0.025em] text-ink">
        {isSignup ? "Créer votre compte" : "Bon retour parmi nous."}
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
        {isSignup
          ? "Vous renseignerez votre entreprise juste après."
          : "Retrouvez vos devis, vos factures et vos règlements."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {isSignup ? (
          <Field id="name" label="Nom et prénom">
            {(props) => (
              <Input {...props} name="name" autoComplete="name" required placeholder="Camille Dupont" />
            )}
          </Field>
        ) : null}

        <Field id="email" label="Adresse e-mail">
          {(props) => (
            <Input
              {...props}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="vous@entreprise.fr"
            />
          )}
        </Field>

        <Field
          id="password"
          label="Mot de passe"
          error={passwordError ?? undefined}
          hint={isSignup ? `${MIN_PASSWORD} caractères minimum.` : undefined}
        >
          {(props) => (
            <Input
              {...props}
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              minLength={isSignup ? MIN_PASSWORD : undefined}
            />
          )}
        </Field>

        {!isSignup ? (
          <Link
            href="/mot-de-passe-oublie"
            className="inline-block text-[13px] font-medium text-blue hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        ) : null}

        {error ? <Alert tone="critical">{error}</Alert> : null}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading
            ? isSignup
              ? "Création du compte…"
              : "Connexion…"
            : isSignup
              ? "Créer mon compte"
              : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-[13.5px] text-muted">
        {isSignup ? (
          <>
            Déjà un compte ?{" "}
            <Link href="/connexion" className="font-medium text-blue hover:underline">
              Se connecter
            </Link>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-medium text-blue hover:underline">
              Essayer gratuitement
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
