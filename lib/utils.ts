import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RentalStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getDashboardPath(role: string) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "LANDLORD":
      return "/dashboard/landlord";
    default:
      return "/dashboard/tenant";
  }
}

export function getStatusBadgeClass(status: RentalStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "APPROVED":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "REJECTED":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "COMPLETED":
      return "bg-stone-100 text-stone-700 border-stone-200";
    default:
      return "bg-stone-100 text-stone-700 border-stone-200";
  }
}

export function getPropertyImage(image?: string | null) {
  return (
    image ||
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
  );
}
