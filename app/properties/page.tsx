import { Suspense } from "react";
import PropertiesPage from "./properties-content";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 xl:grid-cols-3 lg:px-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      }
    >
      <PropertiesPage />
    </Suspense>
  );
}
