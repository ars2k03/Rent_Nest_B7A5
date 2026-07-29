import Cookies from "js-cookie";
import { ROLE_COOKIE, TOKEN_COOKIE } from "./constants";
import type { User, UserRole } from "./types";

export function setAuthCookies(token: string, role: UserRole) {
  Cookies.set(TOKEN_COOKIE, token, { expires: 7, sameSite: "lax" });
  Cookies.set(ROLE_COOKIE, role, { expires: 7, sameSite: "lax" });
}

export function clearAuthCookies() {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(ROLE_COOKIE);
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_COOKIE);
}

export function getRole(): UserRole | undefined {
  return Cookies.get(ROLE_COOKIE) as UserRole | undefined;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function canAccessDashboard(role: UserRole, pathname: string) {
  if (pathname.startsWith("/dashboard/admin")) {
    return role === "ADMIN";
  }
  if (pathname.startsWith("/dashboard/landlord")) {
    return role === "LANDLORD";
  }
  if (pathname.startsWith("/dashboard/tenant")) {
    return role === "TENANT";
  }
  return pathname.startsWith("/dashboard");
}

export function getUserDisplayName(user?: User | null) {
  return user?.name || "Guest";
}
