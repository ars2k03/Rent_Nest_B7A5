"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { landlordService, propertyService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { PropertyForm, type PropertyFormValues } from "@/components/properties/property-form";
import { Card } from "@/components/ui/card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ui/error-alert";
import { normalizeApiError } from "@/lib/api-error";
import { useState } from "react";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["property", params.id],
    queryFn: () => propertyService.getById(params.id),
    enabled: Boolean(params.id),
  });

  const handleSubmit = async (values: PropertyFormValues) => {
    setLoading(true);
    try {
      await landlordService.updateProperty(token!, params.id, values);
      toast.success("Property updated successfully");
      router.push("/dashboard/landlord/properties");
    } catch (submitError) {
      toast.error(normalizeApiError(submitError));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <PropertyCardSkeleton />;
  if (isError) {
    return (
      <DashboardShell title="Edit property">
        <ErrorAlert message={normalizeApiError(error)} />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Edit property" description="Update your listing details.">
      <Card>
        <PropertyForm initialData={data} onSubmit={handleSubmit} loading={loading} />
      </Card>
    </DashboardShell>
  );
}
