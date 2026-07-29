import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[var(--surface-muted)]",
        className
      )}
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
