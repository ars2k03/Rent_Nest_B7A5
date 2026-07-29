import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-[var(--ink)]"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={cn(
          "min-h-28 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-stone-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15",
          error && "border-rose-400",
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
