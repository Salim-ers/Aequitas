"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Field } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { StepIndicator } from "@/components/ui/step-indicator";
import { createOrganizationAction, type OnboardingState } from "./actions";

const INITIAL: OnboardingState = {};

/**
 * §31 — Le formulaire est découpé en trois blocs titrés plutôt que présenté
 * d'un bloc. Il reste sur un seul écran : l'action serveur enregistre
 * l'entreprise en une transaction, il n'y a pas d'état intermédiaire à
 * conserver entre plusieurs pages.
 */
export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(createOrganizationAction, INITIAL);

  return (
    <div>
      <StepIndicator current={1} total={2} label="Votre entreprise" />

      <h1 className="mt-8 text-[1.875rem] font-semibold tracking-[-0.03em] text-ink">
        Parlez-nous de votre entreprise.
      </h1>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
        Ces informations apparaîtront sur vos factures. Vous pourrez les compléter ou les
        corriger plus tard.
      </p>

      <form action={formAction} className="mt-10 space-y-10">
        <section>
          <h2 className="text-[15px] font-semibold text-ink">Identité</h2>
          <div className="mt-4 space-y-4">
            <Field
              id="legalName"
              label="Raison sociale"
              error={state.fieldErrors?.legalName}
            >
              {(props) => (
                <Input {...props} name="legalName" required placeholder="Aequitas SAS" />
              )}
            </Field>

            <Field id="legalForm" label="Forme juridique" optional>
              {(props) => <Input {...props} name="legalForm" placeholder="SAS" />}
            </Field>
          </div>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-ink">Immatriculation</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Ces numéros sont obligatoires sur une facture. Si vous ne les avez pas sous la
            main, vous pourrez les ajouter avant votre première facture.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              id="siren"
              label="SIREN"
              optional
              error={state.fieldErrors?.siren}
              hint="9 chiffres"
            >
              {(props) => (
                <Input {...props} name="siren" inputMode="numeric" placeholder="123456789" />
              )}
            </Field>

            <Field
              id="siret"
              label="SIRET"
              optional
              error={state.fieldErrors?.siret}
              hint="14 chiffres"
            >
              {(props) => (
                <Input
                  {...props}
                  name="siret"
                  inputMode="numeric"
                  placeholder="12345678900012"
                />
              )}
            </Field>
          </div>

          <Field
            id="vatNumber"
            label="TVA intracommunautaire"
            optional
            className="mt-4"
            hint="Laissez vide si votre entreprise n'y est pas assujettie."
          >
            {(props) => <Input {...props} name="vatNumber" placeholder="FR12345678901" />}
          </Field>
        </section>

        <section>
          <h2 className="text-[15px] font-semibold text-ink">Adresse</h2>
          <div className="mt-4 space-y-4">
            <Field id="addressLine1" label="Adresse" optional>
              {(props) => (
                <Input {...props} name="addressLine1" placeholder="12 rue de la Paix" />
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
              <Field id="postalCode" label="Code postal" optional>
                {(props) => (
                  <Input {...props} name="postalCode" inputMode="numeric" placeholder="75002" />
                )}
              </Field>
              <Field id="city" label="Ville" optional>
                {(props) => <Input {...props} name="city" placeholder="Paris" />}
              </Field>
            </div>
          </div>
        </section>

        {state.error ? <Alert tone="critical">{state.error}</Alert> : null}

        <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-[13px] text-faint">Étape 1 sur 2</p>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Enregistrement…" : "Continuer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
