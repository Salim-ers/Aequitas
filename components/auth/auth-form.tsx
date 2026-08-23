"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { authClient } from "@/src/auth/client";

type Mode = "signin" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const name = String(data.get("name") ?? "").trim();

    if (isSignup && password.length < 12) {
      setError("Le mot de passe doit contenir au moins 12 caractères.");
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
            ? "Ce compte n'a pas pu être créé. Vérifiez l'adresse email et réessayez."
            : "Email ou mot de passe incorrect.",
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
      <h1 className="font-semibold text-[1.75rem] tracking-[-0.01em] text-ink">
        {isSignup ? "Créer votre compte" : "Se connecter"}
      </h1>
      <p className="mt-2 text-[14px] text-muted">
        {isSignup
          ? "Quelques secondes suffisent. Vous renseignerez votre entreprise juste après."
          : "Retrouvez vos devis, factures et règlements."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        {isSignup ? (
          <div>
            <Label htmlFor="name">Nom et prénom</Label>
            <Input id="name" name="name" autoComplete="name" required placeholder="Salim Bereksi" />
          </div>
        ) : null}

        <div>
          <Label htmlFor="email">Adresse email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="vous@entreprise.fr"
          />
        </div>

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={isSignup ? 12 : undefined}
            placeholder={isSignup ? "12 caractères minimum" : undefined}
          />
          {!isSignup ? (
            <Link
              href="/mot-de-passe-oublie"
              className="mt-2 inline-block text-[13px] text-blue hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          ) : null}
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-[var(--radius)] border border-[color:var(--color-danger)]/30 bg-danger-soft px-3 py-2 text-[13px] text-danger"
          >
            {error}
          </p>
        ) : null}

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
            <Link href="/connexion" className="text-blue hover:underline">
              Se connecter
            </Link>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-blue hover:underline">
              Commencer gratuitement
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
