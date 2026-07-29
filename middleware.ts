import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard"];
const authRoutes = ["/auth/login", "/auth/register"];

function getRoleDashboard(role?: string) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "LANDLORD":
      return "/dashboard/landlord";
    case "TENANT":
      return "/dashboard/tenant";
    default:
      return "/auth/login";
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("rentnest_token")?.value;
  const role = request.cookies.get("rentnest_role")?.value;

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && token) {
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
    if (pathname.startsWith("/dashboard/landlord") && role !== "LANDLORD") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
    if (pathname.startsWith("/dashboard/tenant") && role !== "TENANT") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
