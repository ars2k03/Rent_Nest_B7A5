"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { landlordService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { DashboardShell } from "@/components/layout/shell";
import { PropertyForm, type PropertyFormValues } from "@/components/properties/property-form";
import { Card } from "@/components/ui/card";
import { normalizeApiError } from "@/lib/api-error";
import { useState } from "react";

export default function NewPropertyPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: PropertyFormValues) => {
    setLoading(true);
    try {
      await landlordService.createProperty(token!, values);
      toast.success("Property created successfully");
      router.push("/dashboard/landlord/properties");
    } catch (error) {
      toast.error(normalizeApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Create property"
      description="Add a new rental listing with details, amenities, and an image URL."
    >
      <Card>
        <PropertyForm onSubmit={handleSubmit} loading={loading} />
      </Card>
    </DashboardShell>
  );
}
