"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorAlert } from "@/components/ui/error-alert";
import { EmptyState } from "@/components/ui/empty-state";
import { normalizeApiError } from "@/lib/api-error";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("1");

  const queryKey = useMemo(() => ["admin-users", search, page], [search, page]);

  const { data, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      adminService.users(token!, {
        search: search || undefined,
        page,
        limit: "10",
      }),
    enabled: Boolean(token),
  });

  const mutation = useMutation({
    mutationFn: ({ id, isDeleted }: { id: string; isDeleted: boolean }) =>
      adminService.updateUser(token!, id, { isDeleted }),
    onSuccess: () => {
      toast.success("User status updated");
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (updateError) => toast.error(normalizeApiError(updateError)),
  });

  return (
    <DashboardShell
      title="User management"
      description="Search users, review roles, and ban or unban accounts."
    >
      <form
        className="mb-6 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          setPage("1");
          void refetch();
        }}
      >
        <Input
          label="Search users"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name or email"
          className="flex-1"
        />
        <div className="flex items-end">
          <Button type="submit">Search</Button>
        </div>
      </form>

      {isError ? (
        <ErrorAlert message={normalizeApiError(error)} onRetry={() => refetch()} />
      ) : null}

      {!data?.users.length ? (
        <EmptyState title="No users found" description="Try a different search term." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--surface-muted)]">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--line)]">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    {user.isDeleted ? "Banned" : "Active"}
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== "ADMIN" ? (
                      <Button
                        size="sm"
                        variant={user.isDeleted ? "secondary" : "danger"}
                        onClick={() => {
                          const action = user.isDeleted ? "unban" : "ban";
                          if (window.confirm(`Confirm ${action} for ${user.email}?`)) {
                            mutation.mutate({ id: user.id, isDeleted: !user.isDeleted });
                          }
                        }}
                        loading={mutation.isPending}
                      >
                        {user.isDeleted ? "Unban" : "Ban"}
                      </Button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={Number(page) <= 1}
          onClick={() => setPage(String(Number(page) - 1))}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={Number(page) >= (data?.meta.totalPages || 1)}
          onClick={() => setPage(String(Number(page) + 1))}
        >
          Next
        </Button>
      </div>
    </DashboardShell>
  );
}
