import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-muted)] px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
