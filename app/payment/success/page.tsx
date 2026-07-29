import { Suspense } from "react";
import PaymentSuccessContent from "./payment-success-content";
import { Card } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
          <Card className="w-full text-center">
            <p className="text-sm text-[var(--muted)]">Verifying payment...</p>
          </Card>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
