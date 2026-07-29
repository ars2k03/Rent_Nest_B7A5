import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface-muted)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--ink)]">
            RentNest
          </p>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
            Find trusted rentals, manage listings, and complete secure payments in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-[var(--muted)]">
          <Link href="/properties" className="hover:text-[var(--ink)]">
            Browse Properties
          </Link>
          <Link href="/auth/register" className="hover:text-[var(--ink)]">
            Create Account
          </Link>
          <Link href="/auth/login" className="hover:text-[var(--ink)]">
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}
