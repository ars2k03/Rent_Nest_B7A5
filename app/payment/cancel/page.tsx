import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
      <Card className="w-full text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
          Payment cancelled
        </h1>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Your payment was not completed. You can return to your dashboard and try again when ready.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard/tenant">
            <Button>Back to dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
