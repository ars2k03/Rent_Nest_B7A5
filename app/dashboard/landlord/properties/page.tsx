"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { landlordService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { formatCurrency } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";

export default function LandlordPropertiesPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: () => landlordService.properties(token!),
    enabled: Boolean(token),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => landlordService.deleteProperty(token!, id),
    onSuccess: () => {
      toast.success("Property deleted");
      void queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (deleteError) => toast.error(normalizeApiError(deleteError)),
  });

  const toggleMutation = useMutation({
    mutationFn: (property: { id: string; isAvailable: boolean }) =>
      landlordService.updateProperty(token!, property.id, {
        isAvailable: !property.isAvailable,
      }),
    onSuccess: () => {
      toast.success("Availability updated");
      void queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
    onError: (toggleError) => toast.error(normalizeApiError(toggleError)),
  });

  return (
    <DashboardShell
      title="Property management"
      description="Edit, delete, or toggle availability for your listings."
      actions={
        <Link href="/dashboard/landlord/properties/new">
          <Button>Add property</Button>
        </Link>
      }
    >
      {isError ? (
        <ErrorAlert message={normalizeApiError(error)} onRetry={() => refetch()} />
      ) : null}
      {!isLoading && !data?.properties.length ? (
        <EmptyState
          title="No properties yet"
          description="Create a listing to start managing rentals."
          action={
            <Link href="/dashboard/landlord/properties/new">
              <Button>Create listing</Button>
            </Link>
          }
        />
      ) : null}
      <div className="space-y-4">
        {data?.properties.map((property) => (
          <Card key={property.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-[var(--ink)]">{property.title}</h3>
              <p className="text-sm text-[var(--muted)]">
                {property.location} • {formatCurrency(property.price)}
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {property.isAvailable ? "Available" : "Unavailable"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => toggleMutation.mutate(property)}
                loading={toggleMutation.isPending}
              >
                Toggle availability
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm("Delete this property?")) {
                    deleteMutation.mutate(property.id);
                  }
                }}
                loading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
