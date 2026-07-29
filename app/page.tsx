import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { propertyService } from "@/lib/services";
import { PropertyCard } from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let properties: Awaited<ReturnType<typeof propertyService.list>>["properties"] = [];

  try {
    const result = await propertyService.list({ limit: 3, isAvailable: "true" });
    properties = result.properties;
  } catch {
    properties = [];
  }

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
          alt="Modern rental home exterior"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b2f24]/92 via-[#0f5c44]/78 to-[#0f5c44]/35" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.3em] text-[#d6efe4]">
            RentNest
          </p>
          <h1 className="animate-fade-up mt-4 max-w-3xl font-[family-name:var(--font-display)] text-5xl font-semibold leading-tight text-white sm:text-6xl">
            RentNest
          </h1>
          <p className="animate-fade-up mt-5 max-w-xl text-lg text-[#e7f4ed]">
            Discover verified rentals, request with confidence, and pay securely when approved.
          </p>
          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/properties">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Properties
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 sm:w-auto"
              >
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Building2,
              title: "Curated listings",
              text: "Browse apartments, houses, and studios with rich details and availability status.",
            },
            {
              icon: ShieldCheck,
              title: "Secure payments",
              text: "Approved tenants complete real Stripe checkout with verified backend status updates.",
            },
            {
              icon: Sparkles,
              title: "Role-based dashboards",
              text: "Tenants, landlords, and admins each get tailored tools for their workflow.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--line)] bg-white p-6"
            >
              <item.icon className="h-6 w-6 text-[var(--brand)]" />
              <h3 className="mt-4 text-lg font-semibold text-[var(--ink)]">{item.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--surface-muted)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                Featured
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
                Available properties
              </h2>
            </div>
            <Link href="/properties" className="text-sm font-medium text-[var(--brand)]">
              View all
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-3xl bg-[var(--brand)] p-8 text-white">
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
            For tenants
          </h3>
          <p className="mt-3 text-sm text-[#d9efe5]">
            Search, request, pay after approval, and leave reviews when your stay is complete.
          </p>
          <Link href="/auth/register" className="mt-6 inline-block">
            <Button variant="secondary">Join as tenant</Button>
          </Link>
        </div>
        <div className="rounded-3xl border border-[var(--line)] bg-white p-8">
          <h3 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--ink)]">
            For landlords
          </h3>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Publish listings, manage availability, and approve rental requests from one dashboard.
          </p>
          <Link href="/auth/register" className="mt-6 inline-block">
            <Button>List a property</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
