import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
        404
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className="mt-6">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}
