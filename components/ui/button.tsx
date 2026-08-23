import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

/**
 * Le navy porte l'action principale. Le rouge de la marque n'est jamais un
 * appel à l'action : la variante `danger` est réservée aux actions
 * destructrices, où le rouge est porteur de sens.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "rounded-[var(--radius)] transition-[background-color,border-color,color,box-shadow] duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-navy text-white shadow-xs hover:bg-navy-hover",
        blue: "bg-blue text-white shadow-xs hover:bg-blue-hover",
        secondary:
          "bg-surface text-ink border border-control shadow-xs hover:bg-surface-2 hover:border-ink-soft",
        ghost: "text-ink-soft hover:bg-surface-2 hover:text-ink",
        subtle: "bg-blue-soft text-blue hover:bg-blue-border/50",
        link: "text-blue underline-offset-4 hover:underline p-0 h-auto font-medium",
        danger: "bg-danger text-white shadow-xs hover:bg-red-dark",
        // Posé sur un fond navy : inversion complète.
        inverse: "bg-white text-navy shadow-xs hover:bg-blue-soft",
      },
      size: {
        sm: "h-8 px-3 text-[13px]",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[15px]",
        xl: "h-12 px-6 text-[15px]",
        "2xl": "h-14 px-7 text-[16px]",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

/**
 * Un lien qui doit ressembler à un bouton. Évite d'imbriquer
 * `<Link><Button>` qui produit un `<a>` contenant un `<button>`.
 */
export const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonVariants>
>(({ className, variant, size, ...props }, ref) => (
  <a ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
ButtonLink.displayName = "ButtonLink";

export { buttonVariants };
