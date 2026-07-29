"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/lib/services";
import { AMENITY_OPTIONS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Property } from "@/lib/types";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  image: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Select a property type"),
  amenities: z.string().optional(),
  isAvailable: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export type PropertyFormValues = {
  title: string;
  description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image?: string;
  categoryId: string;
  amenities: string[];
  isAvailable?: boolean;
};

export function PropertyForm({
  initialData,
  onSubmit,
  loading,
}: {
  initialData?: Property;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  loading?: boolean;
}) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => propertyService.categories(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      price: initialData?.price || 0,
      bedrooms: initialData?.bedrooms || 1,
      bathrooms: initialData?.bathrooms || 1,
      image: initialData?.image || "",
      categoryId: initialData?.categoryId || "",
      amenities: initialData?.amenities?.join(", ") || "",
      isAvailable: initialData?.isAvailable ?? true,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        const amenities = values.amenities
          ? values.amenities
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [];

        await onSubmit({
          ...values,
          image: values.image || undefined,
          amenities,
        });
      })}
      className="grid gap-4 md:grid-cols-2"
    >
      <Input label="Title" error={errors.title?.message} {...register("title")} />
      <Input label="Location" error={errors.location?.message} {...register("location")} />
      <Input label="Price" type="number" error={errors.price?.message} {...register("price")} />
      <Select
        label="Property type"
        error={errors.categoryId?.message}
        options={[
          { label: "Select type", value: "" },
          ...(categories || []).map((category) => ({
            label: category.name,
            value: category.id,
          })),
        ]}
        {...register("categoryId")}
      />
      <Input
        label="Bedrooms"
        type="number"
        error={errors.bedrooms?.message}
        {...register("bedrooms")}
      />
      <Input
        label="Bathrooms"
        type="number"
        error={errors.bathrooms?.message}
        {...register("bathrooms")}
      />
      <Input
        label="Image URL"
        error={errors.image?.message}
        className="md:col-span-2"
        {...register("image")}
      />
      <Textarea
        label="Description"
        error={errors.description?.message}
        className="md:col-span-2"
        {...register("description")}
      />
      <Select
        label="Amenities (comma separated or pick one)"
        options={[
          { label: "Custom / comma separated", value: "" },
          ...AMENITY_OPTIONS.map((amenity) => ({ label: amenity, value: amenity })),
        ]}
        className="md:col-span-2"
        {...register("amenities")}
      />
      <label className="flex items-center gap-2 text-sm text-[var(--ink)] md:col-span-2">
        <input type="checkbox" {...register("isAvailable")} />
        Property is available
      </label>
      <div className="md:col-span-2">
        <Button type="submit" loading={loading}>
          Save property
        </Button>
      </div>
    </form>
  );
}
