"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { paymentService, rentalService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { ReviewForm } from "@/components/reviews/review-form";
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
} from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";

export default function TenantDashboardPage() {
  const { token, user } = useAuth();

  const rentalsQuery = useQuery({
    queryKey: ["tenant-rentals"],
    queryFn: () => rentalService.list(token!),
    enabled: Boolean(token),
  });

  const paymentsQuery = useQuery({
    queryKey: ["tenant-payments"],
    queryFn: () => paymentService.history(token!),
    enabled: Boolean(token),
  });

  return (
    <DashboardShell
      title="Tenant dashboard"
      description={`Welcome back, ${user?.name}. Track your rental requests and payments.`}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-[var(--muted)]">Active requests</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">
            {rentalsQuery.data?.rentals.filter((rental) =>
              ["PENDING", "APPROVED", "ACTIVE"].includes(rental.status)
            ).length || 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Completed payments</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">
            {paymentsQuery.data?.payments.filter((payment) => payment.status === "COMPLETED")
              .length || 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Total requests</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">
            {rentalsQuery.data?.rentals.length || 0}
          </p>
        </Card>
      </div>

      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold text-[var(--ink)]">Rental requests</h2>
        {rentalsQuery.isError ? (
          <ErrorAlert
            message={normalizeApiError(rentalsQuery.error)}
            onRetry={() => rentalsQuery.refetch()}
          />
        ) : null}
        {!rentalsQuery.isLoading && rentalsQuery.data?.rentals.length === 0 ? (
          <EmptyState
            title="No rental requests yet"
            description="Browse properties and submit your first rental request."
            action={
              <Link href="/properties">
                <Button>Browse properties</Button>
              </Link>
            }
          />
        ) : null}
        <div className="space-y-4">
          {rentalsQuery.data?.rentals.map((rental) => (
            <Card key={rental.id} className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--ink)]">
                    {rental.property?.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {rental.property?.location} • Move-in {formatDate(rental.moveInDate)}
                  </p>
                </div>
                <Badge className={getStatusBadgeClass(rental.status)}>
                  {rental.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                {rental.status === "APPROVED" ? (
                  <Link href={`/dashboard/tenant/requests/${rental.id}/pay`}>
                    <Button>Pay now</Button>
                  </Link>
                ) : null}
                {rental.status === "COMPLETED" && rental.property ? (
                  <ReviewForm propertyId={rental.property.id} />
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-[var(--ink)]">Payment history</h2>
        {paymentsQuery.data?.payments.length ? (
          <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--line)] bg-[var(--surface-muted)]">
                <tr>
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentsQuery.data.payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[var(--line)]">
                    <td className="px-4 py-3">
                      {payment.rentalRequest?.property?.title || "Rental payment"}
                    </td>
                    <td className="px-4 py-3">{formatCurrency(payment.amount)}</td>
                    <td className="px-4 py-3">{payment.status}</td>
                    <td className="px-4 py-3">
                      {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No payments yet"
            description="Payments appear here after you complete checkout for approved requests."
          />
        )}
      </div>
    </DashboardShell>
  );
}
