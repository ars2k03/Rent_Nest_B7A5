"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { propertyService } from "@/lib/services";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AMENITY_OPTIONS } from "@/lib/constants";
import { normalizeApiError } from "@/lib/api-error";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") || "",
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      categoryId: searchParams.get("categoryId") || "",
      amenities: searchParams.get("amenities") || "",
      page: searchParams.get("page") || "1",
    }),
    [searchParams]
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => propertyService.categories(),
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () =>
      propertyService.list({
        ...filters,
        isAvailable: "true",
        limit: 9,
      }),
  });

  const updateFilters = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    ["search", "location", "minPrice", "maxPrice", "categoryId", "amenities"].forEach(
      (key) => {
        const value = String(formData.get(key) || "").trim();
        if (value) params.set(key, value);
      }
    );

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
          Browse properties
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Filter by location, price, property type, and amenities.
        </p>
      </div>

      <form
        onSubmit={updateFilters}
        className="mb-8 grid gap-4 rounded-2xl border border-[var(--line)] bg-white p-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <Input name="search" label="Search" defaultValue={filters.search} placeholder="Title or keyword" />
        <Input name="location" label="Location" defaultValue={filters.location} placeholder="City or area" />
        <Input name="minPrice" label="Min price" type="number" defaultValue={filters.minPrice} />
        <Input name="maxPrice" label="Max price" type="number" defaultValue={filters.maxPrice} />
        <Select
          name="categoryId"
          label="Property type"
          defaultValue={filters.categoryId}
          options={[
            { label: "All types", value: "" },
            ...(categories || []).map((category) => ({
              label: category.name,
              value: category.id,
            })),
          ]}
        />
        <Select
          name="amenities"
          label="Amenity"
          defaultValue={filters.amenities}
          options={[
            { label: "Any amenity", value: "" },
            ...AMENITY_OPTIONS.map((amenity) => ({ label: amenity, value: amenity })),
          ]}
        />
        <div className="flex items-end md:col-span-2 xl:col-span-4">
          <Button type="submit">Apply filters</Button>
        </div>
      </form>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : null}

      {isError ? (
        <ErrorAlert message={normalizeApiError(error)} onRetry={() => refetch()} />
      ) : null}

      {!isLoading && !isError && data?.properties.length === 0 ? (
        <EmptyState
          title="No properties found"
          description="Try adjusting your filters or search in a different location."
        />
      ) : null}

      {!isLoading && !isError && data?.properties.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {data.properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
