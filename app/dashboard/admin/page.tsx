"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { normalizeApiError } from "@/lib/api-error";

export default function AdminDashboardPage() {
  const { token } = useAuth();

  const { data, isError, error, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.stats(token!),
    enabled: Boolean(token),
  });

  return (
    <DashboardShell
      title="Admin dashboard"
      description="Monitor platform health and manage users, listings, and rental requests."
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/admin/users">
            <Button variant="secondary" size="sm">
              Manage users
            </Button>
          </Link>
          <Link href="/dashboard/admin/properties">
            <Button variant="secondary" size="sm">
              Moderate properties
            </Button>
          </Link>
          <Link href="/dashboard/admin/rentals">
            <Button variant="secondary" size="sm">
              View rentals
            </Button>
          </Link>
        </div>
      }
    >
      {isError ? (
        <ErrorAlert message={normalizeApiError(error)} onRetry={() => refetch()} />
      ) : null}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total users", value: data?.totalUsers || 0 },
          { label: "Total properties", value: data?.totalProperties || 0 },
          { label: "Pending requests", value: data?.pendingRentals || 0 },
          { label: "Active rentals", value: data?.activeRentals || 0 },
          { label: "Completed payments", value: data?.completedPayments || 0 },
        ].map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-[var(--ink)]">{item.value}</p>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
