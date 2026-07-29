import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--ink)] outline-none transition placeholder:text-stone-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15",
          error && "border-rose-400 focus:border-rose-400 focus:ring-rose-100",
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
