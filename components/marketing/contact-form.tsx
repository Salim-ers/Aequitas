"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

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
      <div className="rounded-[var(--radius-lg)] border border-line bg-surface-2 p-6">
        <p className="text-[15px] font-medium text-ink">Message reçu</p>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">
          Nous répondons sous deux jours ouvrés à l&apos;adresse indiquée.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required minLength={2} />
        </div>
        <div>
          <Label htmlFor="email">Email professionnel</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>

      <div>
        <Label htmlFor="company">Entreprise</Label>
        <Input id="company" name="company" />
      </div>

      <div>
        <Label htmlFor="message">Votre message</Label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={6}
          className="w-full rounded-[var(--radius)] border border-line-strong bg-surface px-3 py-2 text-sm focus-visible:border-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue"
        />
      </div>

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
