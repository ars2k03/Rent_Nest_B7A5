import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] shadow-sm",
  secondary:
    "bg-white text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--surface-muted)]",
  ghost: "bg-transparent text-[var(--ink)] hover:bg-[var(--surface-muted)]",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : null}
      {children}
    </button>
  );
}
