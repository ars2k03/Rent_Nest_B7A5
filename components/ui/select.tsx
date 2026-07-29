import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export function Select({
  label,
  error,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-[var(--ink)]">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15",
          error && "border-rose-400",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
