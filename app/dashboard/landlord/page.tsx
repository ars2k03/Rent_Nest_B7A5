"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { landlordService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { formatCurrency } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";

export default function LandlordDashboardPage() {
  const { token } = useAuth();

  const propertiesQuery = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: () => landlordService.properties(token!),
    enabled: Boolean(token),
  });

  const requestsQuery = useQuery({
    queryKey: ["landlord-requests"],
    queryFn: () => landlordService.requests(token!),
    enabled: Boolean(token),
  });

  const properties = propertiesQuery.data?.properties || [];
  const requests = requestsQuery.data?.rentals || [];
  const earnings = requests
    .filter((request) => request.payment?.status === "COMPLETED")
    .reduce((sum, request) => sum + (request.payment?.amount || 0), 0);

  return (
    <DashboardShell
      title="Landlord dashboard"
      description="Manage your listings, review incoming requests, and track earnings."
      actions={
        <Link href="/dashboard/landlord/properties/new">
          <Button>Add property</Button>
        </Link>
      }
    >
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <p className="text-sm text-[var(--muted)]">Total properties</p>
          <p className="mt-2 text-3xl font-semibold">{properties.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Available</p>
          <p className="mt-2 text-3xl font-semibold">
            {properties.filter((property) => property.isAvailable).length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Incoming requests</p>
          <p className="mt-2 text-3xl font-semibold">
            {requests.filter((request) => request.status === "PENDING").length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--muted)]">Earnings</p>
          <p className="mt-2 text-3xl font-semibold">{formatCurrency(earnings)}</p>
        </Card>
      </div>

      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your properties</h2>
          <Link href="/dashboard/landlord/properties">
            <Button variant="secondary" size="sm">
              Manage all
            </Button>
          </Link>
        </div>
        {propertiesQuery.isError ? (
          <ErrorAlert
            message={normalizeApiError(propertiesQuery.error)}
            onRetry={() => propertiesQuery.refetch()}
          />
        ) : null}
        {!properties.length ? (
          <EmptyState
            title="No properties listed"
            description="Create your first listing to start receiving rental requests."
            action={
              <Link href="/dashboard/landlord/properties/new">
                <Button>Create listing</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {properties.slice(0, 4).map((property) => (
              <Card key={property.id}>
                <h3 className="font-semibold">{property.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{property.location}</p>
                <p className="mt-3 font-semibold text-[var(--brand)]">
                  {formatCurrency(property.price)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
