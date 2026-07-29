"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { MapPin, BedDouble, Bath } from "lucide-react";
import { propertyService } from "@/lib/services";
import { RentalRequestForm } from "@/components/rentals/rental-request-form";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "@/components/ui/error-alert";
import { Card } from "@/components/ui/card";
import { formatCurrency, getPropertyImage } from "@/lib/utils";
import { normalizeApiError } from "@/lib/api-error";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api-error";

export function PropertyDetail({ id }: { id: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyService.getById(id),
    retry: false,
  });

  if (isLoading) return <PropertyCardSkeleton />;
  if (isError) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <ErrorAlert message={normalizeApiError(error)} />;
  }
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="relative h-[28rem] overflow-hidden rounded-3xl">
            <Image
              src={getPropertyImage(data.image)}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                {data.category?.name}
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--ink)]">
                {data.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-[var(--muted)]">
                <MapPin className="h-4 w-4" />
                {data.location}
              </p>
            </div>
            <p className="text-base leading-7 text-[var(--muted)]">{data.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--ink)]">
              <span className="inline-flex items-center gap-2">
                <BedDouble className="h-4 w-4" />
                {data.bedrooms} bedrooms
              </span>
              <span className="inline-flex items-center gap-2">
                <Bath className="h-4 w-4" />
                {data.bathrooms} bathrooms
              </span>
            </div>
            {data.amenities?.length ? (
              <div className="flex flex-wrap gap-2">
                {data.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-sm text-[var(--muted)]"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            ) : null}
            {data.landlord ? (
              <Card>
                <h3 className="font-semibold text-[var(--ink)]">Landlord</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{data.landlord.name}</p>
              </Card>
            ) : null}
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <p className="text-sm text-[var(--muted)]">Monthly rent</p>
            <p className="mt-1 text-3xl font-semibold text-[var(--brand)]">
              {formatCurrency(data.price)}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {data.isAvailable ? "Available now" : "Currently unavailable"}
            </p>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-[var(--ink)]">Request to rent</h2>
            <div className="mt-4">
              <RentalRequestForm property={data} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
