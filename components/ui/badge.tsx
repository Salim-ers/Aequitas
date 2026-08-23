import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
  {
    variants: {
      tone: {
        neutral: "border-line-strong bg-paper-sunken text-slate",
        petrol: "border-transparent bg-petrol-soft text-petrol",
        brass: "border-transparent bg-brass-soft text-brass",
        success: "border-transparent bg-petrol-soft text-success",
        warning: "border-transparent bg-brass-soft text-warning",
        danger: "border-transparent bg-danger-soft text-danger",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
