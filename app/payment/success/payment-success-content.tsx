"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { paymentService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { normalizeApiError } from "@/lib/api-error";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [message, setMessage] = useState("Verifying your payment...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      const rentalRequestId = searchParams.get("rentalRequestId");
      const sessionId = searchParams.get("session_id");

      if (!token || !rentalRequestId || !sessionId) {
        setError("Missing payment verification details.");
        return;
      }

      try {
        await paymentService.confirm(token, {
          rentalRequestId,
          transactionId: sessionId,
          sessionId,
          provider: "STRIPE",
        });
        setMessage("Payment completed successfully. Your rental is now active.");
        toast.success("Payment verified");
      } catch (verifyError) {
        setError(normalizeApiError(verifyError));
      }
    };

    void verify();
  }, [searchParams, token]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-16">
      <Card className="w-full text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
          Payment success
        </h1>
        {error ? (
          <div className="mt-6">
            <ErrorAlert message={error} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">{message}</p>
        )}
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard/tenant">
            <Button>Go to tenant dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
