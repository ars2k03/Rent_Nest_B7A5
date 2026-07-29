"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rentalService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { normalizeApiError } from "@/lib/api-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/types";

const schema = z.object({
  moveInDate: z.string().min(1, "Move-in date is required"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RentalRequestForm({ property }: { property: Property }) {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      rentalService.create(token!, {
        propertyId: property.id,
        moveInDate: values.moveInDate,
        message: values.message,
      }),
    onSuccess: () => {
      toast.success("Rental request submitted successfully");
      reset();
      void queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
    },
    onError: (error) => toast.error(normalizeApiError(error)),
  });

  if (!user) {
    return (
      <p className="text-sm text-[var(--muted)]">
        Please sign in as a tenant to request this property.
      </p>
    );
  }

  if (user.role !== "TENANT") {
    return (
      <p className="text-sm text-[var(--muted)]">
        Only tenant accounts can submit rental requests.
      </p>
    );
  }

  if (!property.isAvailable) {
    return (
      <p className="text-sm text-rose-600">
        This property is currently unavailable for new requests.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
      <Input
        label="Move-in date"
        type="date"
        error={errors.moveInDate?.message}
        {...register("moveInDate")}
      />
      <Textarea
        label="Message to landlord"
        placeholder="Share your preferred move-in timeline or questions"
        error={errors.message?.message}
        {...register("message")}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Request to rent
      </Button>
    </form>
  );
}
