import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatCurrency, getPropertyImage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group overflow-hidden rounded-2xl border border-[var(--line)] bg-white transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,61,46,0.12)]"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={getPropertyImage(property.image)}
          alt={property.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute left-4 top-4">
          <Badge
            className={
              property.isAvailable
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-stone-200 bg-stone-100 text-stone-700"
            }
          >
            {property.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-[var(--ink)]">{property.title}</h3>
          <p className="text-lg font-semibold text-[var(--brand)]">
            {formatCurrency(property.price)}
          </p>
        </div>
        <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <MapPin className="h-4 w-4" />
          {property.location}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
          <span>{property.category?.name || "Property"}</span>
          <span>•</span>
          <span>
            {property.bedrooms} bed • {property.bathrooms} bath
          </span>
        </div>
        {property.amenities?.length ? (
          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {amenity}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
