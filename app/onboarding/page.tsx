"use client";

import { useActionState } from "react";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AequitasLogo } from "@/components/brand/aequitas-logo";
import { createOrganizationAction, type OnboardingState } from "./actions";

const INITIAL: OnboardingState = {};

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(createOrganizationAction, INITIAL);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <AequitasLogo />

      <div className="mt-8">
        <p className="eyebrow">Étape 1 / 6</p>
        <h1 className="mt-3 font-semibold text-[1.875rem] tracking-[-0.015em] text-ink">
          Votre entreprise
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Ces informations apparaîtront sur vos factures. Vous pourrez les compléter plus
          tard dans les paramètres.
        </p>
      </div>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <Label htmlFor="legalName">Raison sociale</Label>
          <Input id="legalName" name="legalName" required placeholder="Aequitas SAS" />
          {state.fieldErrors?.legalName ? (
            <p className="mt-1 text-[12.5px] text-danger">{state.fieldErrors.legalName}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="legalForm">Forme juridique</Label>
            <Input id="legalForm" name="legalForm" placeholder="SAS" />
          </div>
          <div>
            <Label htmlFor="vatNumber">TVA intracommunautaire</Label>
            <Input id="vatNumber" name="vatNumber" placeholder="FR12345678901" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="siren">SIREN</Label>
            <Input id="siren" name="siren" inputMode="numeric" placeholder="123456789" />
            {state.fieldErrors?.siren ? (
              <p className="mt-1 text-[12.5px] text-danger">{state.fieldErrors.siren}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="siret">SIRET</Label>
            <Input id="siret" name="siret" inputMode="numeric" placeholder="12345678900012" />
            {state.fieldErrors?.siret ? (
              <p className="mt-1 text-[12.5px] text-danger">{state.fieldErrors.siret}</p>
            ) : null}
          </div>
        </div>

        <div>
          <Label htmlFor="addressLine1">Adresse</Label>
          <Input id="addressLine1" name="addressLine1" placeholder="12 rue de la Paix" />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input id="postalCode" name="postalCode" placeholder="75002" />
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" placeholder="Paris" />
          </div>
        </div>

        {state.error ? (
          <p role="alert" className="rounded-[var(--radius)] border border-[color:var(--color-danger)]/30 bg-danger-soft px-3 py-2 text-[13px] text-danger">
            {state.error}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Création…" : "Continuer"}
        </Button>
      </form>
    </div>
  );
}
