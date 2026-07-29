"use client";

import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";

export default function AdminPropertiesPage() {
  const { token } = useAuth();

  const { data, isError, error, refetch } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => adminService.properties(token!),
    enabled: Boolean(token),
  });

  return (
    <DashboardShell
      title="Property moderation"
      description="Inspect all listings across the platform."
    >
      {isError ? (
        <ErrorAlert message={normalizeApiError(error)} onRetry={() => refetch()} />
      ) : null}
      {!data?.properties.length ? (
        <EmptyState title="No properties found" description="No listings are available yet." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.properties.map((property) => (
            <Card key={property.id}>
              <h3 className="font-semibold text-[var(--ink)]">{property.title}</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{property.location}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Landlord: {property.landlord?.name}
              </p>
              <p className="mt-2 font-semibold text-[var(--brand)]">
                {formatCurrency(property.price)}
              </p>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
