import * as React from "react";
import { cn } from "@/src/lib/utils";

const fieldBase = [
  "w-full rounded-[var(--radius)] border border-line-strong bg-surface text-ink shadow-xs",
  "placeholder:text-faint",
  "transition-[border-color,box-shadow] duration-150",
  "focus-visible:outline-none focus-visible:border-blue focus-visible:ring-4 focus-visible:ring-blue-soft",
  "disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-faint",
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger-soft",
].join(" ");

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(fieldBase, "h-10 px-3 text-sm", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldBase, "min-h-24 px-3 py-2.5 text-sm leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldBase, "h-10 cursor-pointer px-3 text-sm", className)}
    {...props}
  />
));
Select.displayName = "Select";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { optional?: boolean }
>(({ className, optional, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("mb-1.5 block text-[13px] font-medium text-ink-soft", className)}
    {...props}
  >
    {children}
    {optional ? <span className="ml-1.5 font-normal text-faint">facultatif</span> : null}
  </label>
));
Label.displayName = "Label";

/**
 * Champ complet : libellé, aide, erreur — tous reliés au contrôle par `id`.
 * C'est ce câblage qui rend le formulaire utilisable au lecteur d'écran.
 */
export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  optional?: boolean;
  children: (props: {
    id: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
  }) => React.ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
      })}
      {error ? (
        <p id={errorId} className="mt-1.5 text-[12.5px] text-danger">
          {error}
        </p>
      ) : null}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-[12.5px] leading-relaxed text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
