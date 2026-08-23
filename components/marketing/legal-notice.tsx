import { Alert } from "@/components/ui/alert";

/** §70 — Bandeau obligatoire sur chaque page légale. */
export function LegalDraftNotice() {
  return (
    <Alert tone="warning" title="Modèle à faire valider" className="mb-10">
      Ce texte est une trame de travail, pas un document juridique opposable. Il doit
      être relu et complété par un avocat avant publication. Aequitas ne remplace pas un
      conseil juridique.
    </Alert>
  );
}
