import { Suspense } from "react";
import LoginPage from "./login-content";

export default function Page() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-center text-sm text-[var(--muted)]">Loading sign in...</div>}>
      <LoginPage />
    </Suspense>
  );
}
