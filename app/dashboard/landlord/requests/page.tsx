"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { landlordService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { formatDate, getStatusBadgeClass } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";

export default function LandlordRequestsPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["landlord-requests"],
    queryFn: () => landlordService.requests(token!),
    enabled: Boolean(token),
  });

  const mutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "APPROVED" | "REJECTED" | "COMPLETED";
    }) => landlordService.updateRequest(token!, id, { status }),
    onSuccess: () => {
      toast.success("Request updated");
      void queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
    },
    onError: (updateError) => toast.error(normalizeApiError(updateError)),
  });

  return (
    <DashboardShell
      title="Incoming requests"
      description="Review tenant requests and approve, reject, or mark rentals as completed."
    >
      {isError ? (
        <ErrorAlert message={normalizeApiError(error)} onRetry={() => refetch()} />
      ) : null}
      {!isLoading && !data?.rentals.length ? (
        <EmptyState
          title="No requests yet"
          description="When tenants request your properties, they will appear here."
        />
      ) : null}
      <div className="space-y-4">
        {data?.rentals.map((request) => (
          <Card key={request.id} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-[var(--ink)]">
                  {request.property?.title}
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {request.tenant?.name} • {formatDate(request.moveInDate)}
                </p>
              </div>
              <Badge className={getStatusBadgeClass(request.status)}>
                {request.status}
              </Badge>
            </div>
            {request.message ? (
              <p className="text-sm text-[var(--muted)]">{request.message}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              {request.status === "PENDING" ? (
                <>
                  <Button
                    size="sm"
                    onClick={() =>
                      mutation.mutate({ id: request.id, status: "APPROVED" })
                    }
                    loading={mutation.isPending}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      mutation.mutate({ id: request.id, status: "REJECTED" })
                    }
                    loading={mutation.isPending}
                  >
                    Reject
                  </Button>
                </>
              ) : null}
              {request.status === "ACTIVE" ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    mutation.mutate({ id: request.id, status: "COMPLETED" })
                  }
                  loading={mutation.isPending}
                >
                  Mark completed
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
