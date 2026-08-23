/** §70 — Bandeau obligatoire sur chaque page légale. */
export function LegalDraftNotice() {
  return (
    <div className="mb-10 rounded-[var(--radius)] border border-[color:var(--color-warning)]/40 bg-warning-soft px-4 py-3">
      <p className="text-[13px] leading-relaxed text-ink-soft">
        <strong className="font-medium">Modèle à faire valider.</strong> Ce texte est une
        trame de travail, pas un document juridique opposable. Il doit être relu et complété
        par un avocat avant publication. Aequitas ne remplace pas un conseil juridique.
      </p>
    </div>
  );
}
