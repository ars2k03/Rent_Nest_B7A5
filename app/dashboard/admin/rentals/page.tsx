"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ErrorAlert } from "@/components/ui/error-alert";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate, getStatusBadgeClass } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";

export default function AdminRentalsPage() {
  const { token } = useAuth();

  const { data, isError, error, refetch } = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => adminService.rentals(token!),
    enabled: Boolean(token),
  });

  return (
    <DashboardShell
      title="Rental moderation"
      description="Review rental requests across all properties and tenants."
    >
      {isError ? (
        <ErrorAlert message={normalizeApiError(error)} onRetry={() => refetch()} />
      ) : null}
      {!data?.rentals.length ? (
        <EmptyState title="No rental requests" description="No requests have been submitted yet." />
      ) : (
        <div className="space-y-4">
          {data.rentals.map((rental) => (
            <Card key={rental.id} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--ink)]">
                    {rental.property?.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    Tenant: {rental.tenant?.name} • {formatDate(rental.moveInDate)}
                  </p>
                </div>
                <Badge className={getStatusBadgeClass(rental.status)}>
                  {rental.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
