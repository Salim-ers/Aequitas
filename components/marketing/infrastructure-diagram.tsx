import { FileText, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/src/lib/utils";

/**
 * Schéma de l'architecture cible.
 *
 * Les connecteurs reprennent le motif de circuit du logo : segment, nœud,
 * segment. Le dernier maillon est en trait discontinu et porte la mention
 * « Après immatriculation » — tant que le statut n'est pas délivré, aucun
 * élément ne doit suggérer un raccordement actif.
 */

const AEQUITAS_STEPS = [
  { icon: FileText, label: "Création" },
  { icon: ShieldCheck, label: "Contrôles" },
  { icon: Activity, label: "Suivi" },
];

/** Connecteur vertical façon piste de circuit imprimé. */
function Connector({ dashed = false, label }: { dashed?: boolean; label?: string }) {
  return (
    <div className="flex flex-col items-center py-2" aria-hidden="true">
      <svg width="2" height="16" viewBox="0 0 2 16" className="overflow-visible">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={dashed ? "3 3" : undefined}
          className={dashed ? "text-white/25" : "text-white/40"}
        />
      </svg>
      <span
        className={cn(
          "my-1 size-2 rounded-full",
          dashed ? "bg-white/25" : "bg-white/50",
        )}
      />
      <svg width="2" height="16" viewBox="0 0 2 16" className="overflow-visible">
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray={dashed ? "3 3" : undefined}
          className={dashed ? "text-white/25" : "text-white/40"}
        />
      </svg>
      {label ? (
        <span className="mt-2 rounded-full border border-dashed border-white/25 px-2.5 py-1 text-[11px] uppercase tracking-[0.07em] text-white/50">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function InfrastructureDiagram({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex max-w-sm flex-col items-stretch", className)}>
      <div className="rounded-[var(--radius-lg)] border border-white/15 bg-white/[0.06] px-5 py-4 text-center">
        <p className="text-[15px] font-medium text-white">Votre entreprise</p>
      </div>

      <Connector />

      {/* Le maillon Aequitas, seul élément mis en avant. */}
      <div className="rounded-[var(--radius-lg)] border border-white/30 bg-white/[0.12] px-5 py-5">
        <p className="text-center text-[17px] font-semibold tracking-[0.02em] text-white">
          Aequitas
        </p>
        <ul className="mt-4 space-y-2">
          {AEQUITAS_STEPS.map((step) => (
            <li
              key={step.label}
              className="flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-white/[0.07] px-3 py-2 text-[13.5px] text-white/85"
            >
              <step.icon className="size-4 shrink-0 text-white/60" aria-hidden="true" />
              {step.label}
            </li>
          ))}
        </ul>
      </div>

      <Connector dashed label="Après immatriculation" />

      <div className="rounded-[var(--radius-lg)] border border-dashed border-white/25 px-5 py-4 text-center">
        <p className="text-[15px] font-medium text-white/60">
          Écosystème français de facturation électronique
        </p>
      </div>

      <p className="mt-5 text-center text-[12.5px] leading-relaxed text-white/45">
        Le dernier maillon décrit l&apos;architecture visée. Il ne sera actif
        qu&apos;après obtention de l&apos;immatriculation.
      </p>
    </div>
  );
}
