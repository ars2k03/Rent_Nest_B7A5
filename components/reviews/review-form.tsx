"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/lib/services";
import { useAuth } from "@/providers/auth-provider";
import { normalizeApiError } from "@/lib/api-error";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const schema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

type FormValues = z.infer<typeof schema>;

export function ReviewForm({ propertyId }: { propertyId: string }) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      reviewService.create(token!, { propertyId, ...values }),
    onSuccess: () => {
      toast.success("Review submitted successfully");
      reset();
      void queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
    },
    onError: (error) => toast.error(normalizeApiError(error)),
  });

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="w-full max-w-md space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4"
    >
      <p className="text-sm font-semibold text-[var(--ink)]">Leave a review</p>
      <Input
        label="Rating (1-5)"
        type="number"
        min={1}
        max={5}
        error={errors.rating?.message}
        {...register("rating")}
      />
      <Textarea
        label="Comment"
        error={errors.comment?.message}
        {...register("comment")}
      />
      <Button type="submit" size="sm" loading={mutation.isPending}>
        Submit review
      </Button>
    </form>
  );
}
