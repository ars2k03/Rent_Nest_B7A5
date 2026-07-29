"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentService, rentalService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";

export default function TenantPaymentPage() {
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tenant-rental", params.id],
    queryFn: () => rentalService.getById(token!, params.id),
    enabled: Boolean(token && params.id),
  });

  const handlePay = async () => {
    if (!token || !data) return;
    setLoading(true);
    try {
      const result = await paymentService.create(token, {
        rentalRequestId: data.id,
        provider: "STRIPE",
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      toast.error("Unable to start payment session.");
    } catch (paymentError) {
      toast.error(normalizeApiError(paymentError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.payment?.status === "COMPLETED") {
      toast.info("Payment already completed for this request.");
    }
  }, [data]);

  if (isLoading) return <PropertyCardSkeleton />;
  if (isError) {
    return (
      <DashboardShell title="Payment">
        <ErrorAlert message={normalizeApiError(error)} />
      </DashboardShell>
    );
  }

  if (!data || data.status !== "APPROVED") {
    return (
      <DashboardShell title="Payment unavailable">
        <ErrorAlert message="This rental request is not eligible for payment." />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Complete payment"
      description="You will be redirected to Stripe Checkout to complete your rental payment securely."
    >
      <Card className="max-w-2xl space-y-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Property</p>
          <h2 className="text-xl font-semibold text-[var(--ink)]">
            {data.property?.title}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--muted)]">Amount</p>
            <p className="text-2xl font-semibold text-[var(--brand)]">
              {formatCurrency(data.property?.price || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">Move-in date</p>
            <p className="font-medium text-[var(--ink)]">
              {formatDate(data.moveInDate)}
            </p>
          </div>
        </div>
        <Button onClick={handlePay} loading={loading} className="w-full sm:w-auto">
          Proceed to Stripe Checkout
        </Button>
      </Card>
    </DashboardShell>
  );
}
