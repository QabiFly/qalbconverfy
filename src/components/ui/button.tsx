import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes < HTMLButtonElement > {
  variant ? : ButtonVariant;
  size ? : ButtonSize;
  isLoading ? : boolean;
  fullWidth ? : boolean;
}

const variantStyles: Record < ButtonVariant, string > = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-muted active:bg-accent-muted disabled:bg-accent/40",
  secondary: "bg-surface-raised text-text-primary hover:bg-surface-hover border border-border",
  outline: "bg-transparent text-text-primary border border-border hover:border-accent/50 hover:text-accent",
  ghost: "bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary",
  danger: "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/40",
};

const sizeStyles: Record < ButtonSize, string > = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export const Button = forwardRef < HTMLButtonElement,
  ButtonProps > (
    ({ className, variant = "primary", size = "md", isLoading = false, fullWidth = false, disabled, children, ...props },
      ref
    ) => {
      return (
        <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
      );
    }
  );

Button.displayName = "Button";