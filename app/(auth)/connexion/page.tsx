import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default function SignInPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate">Chargement…</p>}>
      <AuthForm mode="signin" />
    </Suspense>
  );
}
