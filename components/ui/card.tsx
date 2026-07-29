import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[0_12px_40px_rgba(15,61,46,0.06)]",
        className
      )}
    >
      {children}
    </div>
  );
}
