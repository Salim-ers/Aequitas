"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Field } from "@/components/ui/input";
import { SuccessAlert } from "@/components/ui/alert";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        toast.error("Le message n'a pas pu être envoyé. Vérifiez les champs.");
        return;
      }
      setSent(true);
    } catch {
      toast.error("Le message n'a pas pu être envoyé. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <SuccessAlert title="Message reçu">
        Nous répondons sous deux jours ouvrés à l&apos;adresse indiquée.
      </SuccessAlert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="name" label="Nom">
          {(props) => <Input {...props} name="name" required minLength={2} autoComplete="name" />}
        </Field>
        <Field id="email" label="E-mail professionnel">
          {(props) => (
            <Input {...props} name="email" type="email" required autoComplete="email" />
          )}
        </Field>
      </div>

      <Field id="company" label="Entreprise" optional>
        {(props) => <Input {...props} name="company" autoComplete="organization" />}
      </Field>

      <Field
        id="message"
        label="Votre message"
        hint="Dix caractères minimum. Décrivez votre besoin en quelques lignes."
      >
        {(props) => <Textarea {...props} name="message" required minLength={10} rows={6} />}
      </Field>

      {/* Champ piège, masqué aux lecteurs d'écran comme aux humains. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
