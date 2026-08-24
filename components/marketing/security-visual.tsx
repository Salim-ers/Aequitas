import { cn } from "@/src/lib/utils";

/**
 * Visuel de la section sécurité.
 *
 * Composition abstraite construite sur le motif de circuit du logo :
 * anneaux concentriques, pistes et nœuds convergeant vers un coffre central.
 * Elle est tracée en SVG, donc nette à toute taille et sans fichier à charger.
 *
 * Pas de photographie : nous n'avons pas de banque d'images propriétaire, et
 * une photo générique produirait exactement l'effet « gabarit » que le reste
 * du site évite.
 */
export function SecurityVisual({ className }: { className?: string }) {
  const rings = [
    { r: 148, opacity: 0.06 },
    { r: 116, opacity: 0.09 },
    { r: 84, opacity: 0.13 },
  ];

  // Pistes rayonnantes, terminées par un nœud — comme les amorces du logo.
  const traces = [
    { angle: -150, length: 132 },
    { angle: -90, length: 158 },
    { angle: -30, length: 132 },
    { angle: 30, length: 148 },
    { angle: 90, length: 120 },
    { angle: 150, length: 148 },
  ];

  return (
    <div
      className={cn(
        "on-navy relative overflow-hidden rounded-[28px] bg-navy",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 340" className="w-full">
        <defs>
          <radialGradient id="aeq-sec-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6f9bea" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#6f9bea" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="aeq-sec-vault" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="170" r="170" fill="url(#aeq-sec-glow)" />

        {rings.map((ring) => (
          <circle
            key={ring.r}
            cx="200"
            cy="170"
            r={ring.r}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={ring.opacity}
            strokeWidth="1"
          />
        ))}

        {traces.map((trace) => {
          const rad = (trace.angle * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * trace.length;
          const y = 170 + Math.sin(rad) * trace.length;
          const startX = 200 + Math.cos(rad) * 62;
          const startY = 170 + Math.sin(rad) * 62;
          return (
            <g key={trace.angle}>
              <line
                x1={startX}
                y1={startY}
                x2={x}
                y2={y}
                stroke="#ffffff"
                strokeOpacity="0.16"
                strokeWidth="1.5"
              />
              <circle cx={x} cy={y} r="4" fill="#ffffff" fillOpacity="0.28" />
            </g>
          );
        })}

        {/* Coffre central : la donnée, tenue au milieu du dispositif. */}
        <rect
          x="152"
          y="124"
          width="96"
          height="92"
          rx="18"
          fill="url(#aeq-sec-vault)"
          stroke="#ffffff"
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
        <path
          d="M182 160v-10a18 18 0 0 1 36 0v10"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.55"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="176"
          y="160"
          width="48"
          height="36"
          rx="8"
          fill="#ffffff"
          fillOpacity="0.72"
        />

        {/* Filet tricolore, signature de marque. */}
        <g transform="translate(170 262)">
          <rect width="20" height="3" rx="1.5" fill="#6f9bea" />
          <rect x="20" width="20" height="3" rx="1.5" fill="#ffffff" />
          <rect x="40" width="20" height="3" rx="1.5" fill="#E1000F" />
        </g>
      </svg>
    </div>
  );
}
