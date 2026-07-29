import type { ReactNode } from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "./button";

export function ErrorAlert({
  title,
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">{title || "Something went wrong"}</p>
        <p className="mt-1 text-sm">{message}</p>
        {onRetry ? (
          <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function ForbiddenState({
  title = "Access denied",
  message = "You do not have permission to view this page.",
  action,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-6 py-16 text-center">
      <ShieldAlert className="h-10 w-10 text-[var(--brand)]" />
      <h2 className="mt-4 text-xl font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-[var(--muted)]">{message}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
