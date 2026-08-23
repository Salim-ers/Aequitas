import { cn } from "@/src/lib/utils";

/**
 * Identité Aequitas.
 *
 * Le symbole est un « A » géométrique scindé en deux jambages : navy à gauche,
 * rouge à droite, séparés par une réserve blanche. Les traverses horizontales
 * et les nœuds reprennent le motif de circuit du logo.
 *
 * Le mot-marque est du texte réel plutôt qu'un tracé : il reste sélectionnable,
 * lisible par les lecteurs d'écran et net à toutes les tailles.
 */

export type BrandTone = "color" | "light" | "mono";

function palette(tone: BrandTone) {
  switch (tone) {
    case "light":
      // Posé sur un fond sombre : monochrome blanc.
      return { left: "#FFFFFF", right: "#FFFFFF" };
    case "mono":
      // Impression et contextes monochromes : suit la couleur du texte.
      return { left: "currentColor", right: "currentColor" };
    default:
      return { left: "var(--color-navy)", right: "var(--color-red)" };
  }
}

/**
 * Symbole seul.
 * Les amorces de circuit ne sont dessinées qu'au-delà de ~32 px (`detailed`) ;
 * en dessous elles se referment en bouillie de pixels.
 */
export function AequitasMark({
  className,
  tone = "color",
  detailed = false,
  label,
}: {
  className?: string;
  tone?: BrandTone;
  detailed?: boolean;
  label?: string;
}) {
  const c = palette(tone);
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("size-7 shrink-0", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* Jambage gauche. */}
      <path d="M20 6h11L13 58H2z" fill={c.left} />
      {/* Demi-traverse gauche. */}
      <path d="M19.9 38H31l-2.8 8H17.1z" fill={c.left} />
      {/* Jambage droit, pente miroir : les deux convergent au sommet. */}
      <path d="M33 6h11l18 52H51z" fill={c.right} />
      {/* Demi-traverse droite. Le canal blanc central n'est jamais comblé. */}
      <path d="M33 38h11.1l2.8 8H35.8z" fill={c.right} />

      {detailed ? (
        <g>
          <path d="M11.5 30H5.6" stroke={c.left} strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="2.8" cy="30" r="2.6" fill={c.left} />
          <path d="M52.5 30h5.9" stroke={c.right} strokeWidth="2.1" strokeLinecap="round" />
          <circle cx="61.2" cy="30" r="2.6" fill={c.right} />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * Logo complet : symbole + mot-marque.
 * `compact` réduit le mot-marque pour les barres denses ; `stacked` empile
 * pour les grands formats (page d'authentification, écrans d'accueil).
 */
export function AequitasLogo({
  className,
  tone = "color",
  variant = "full",
  detailed = false,
}: {
  className?: string;
  tone?: BrandTone;
  variant?: "full" | "compact" | "stacked";
  detailed?: boolean;
}) {
  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-3", className)}>
        <AequitasMark className="size-14" tone={tone} detailed={detailed} />
        <Wordmark tone={tone} className="text-[17px] tracking-[0.3em]" />
      </span>
    );
  }

  const compact = variant === "compact";
  return (
    <span className={cn("inline-flex items-center", compact ? "gap-2" : "gap-2.5", className)}>
      <AequitasMark
        className={compact ? "size-6" : "size-7"}
        tone={tone}
        detailed={detailed}
      />
      <Wordmark
        tone={tone}
        className={compact ? "text-[13px] tracking-[0.2em]" : "text-[15px] tracking-[0.22em]"}
      />
    </span>
  );
}

function Wordmark({ tone, className }: { tone: BrandTone; className?: string }) {
  return (
    <span
      className={cn(
        "font-semibold uppercase leading-none",
        tone === "light" ? "text-white" : tone === "mono" ? "text-current" : "text-navy",
        className,
      )}
    >
      Aequitas
    </span>
  );
}
