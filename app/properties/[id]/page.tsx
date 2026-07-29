import { Suspense } from "react";
import { PropertyDetail } from "@/components/properties/property-detail";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<PropertyCardSkeleton />}>
      <PropertyDetail id={id} />
    </Suspense>
  );
}
