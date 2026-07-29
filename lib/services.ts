import { apiRequest } from "./api";
import type {
  AdminStats,
  Category,
  CreatePaymentResponse,
  LoginResponse,
  PaginationMeta,
  Payment,
  Property,
  RentalRequest,
  Review,
  User,
} from "./types";

function buildQuery(params?: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  return query.toString();
}

export const authService = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    role: "TENANT" | "LANDLORD";
    phone?: string;
  }) => apiRequest<User>("/api/auth/register", { method: "POST", body }),

  login: (body: { email: string; password: string }) =>
    apiRequest<LoginResponse>("/api/auth/login", { method: "POST", body }),

  me: (token: string) =>
    apiRequest<User>("/api/auth/me", { token }),
};

export const propertyService = {
  list: (params?: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    const qs = query.toString();
    return apiRequest<{ properties: Property[]; meta: PaginationMeta }>(
      `/api/properties${qs ? `?${qs}` : ""}`
    );
  },

  getById: (id: string) => apiRequest<Property>(`/api/properties/${id}`),

  categories: () => apiRequest<Category[]>("/api/categories"),
};

export const rentalService = {
  create: (
    token: string,
    body: { propertyId: string; moveInDate: string; message?: string }
  ) =>
    apiRequest<RentalRequest>("/api/rentals", { method: "POST", body, token }),

  list: (token: string, params?: Record<string, string | undefined>) => {
    const qs = buildQuery(params);
    return apiRequest<{ rentals: RentalRequest[]; meta: PaginationMeta }>(
      `/api/rentals${qs ? `?${qs}` : ""}`,
      { token }
    );
  },

  getById: (token: string, id: string) =>
    apiRequest<RentalRequest>(`/api/rentals/${id}`, { token }),
};

export const paymentService = {
  create: (
    token: string,
    body: { rentalRequestId: string; provider: "STRIPE" | "SSLCOMMERZ" }
  ) =>
    apiRequest<CreatePaymentResponse>("/api/payments/create", {
      method: "POST",
      body,
      token,
    }),

  confirm: (
    token: string,
    body: {
      rentalRequestId: string;
      transactionId: string;
      provider: "STRIPE" | "SSLCOMMERZ";
      sessionId?: string;
    }
  ) =>
    apiRequest<Payment>("/api/payments/confirm", {
      method: "POST",
      body,
      token,
    }),

  history: (token: string) =>
    apiRequest<{ payments: Payment[]; meta: PaginationMeta }>(
      "/api/payments",
      { token }
    ),

  getById: (token: string, id: string) =>
    apiRequest<Payment>(`/api/payments/${id}`, { token }),
};

export const reviewService = {
  create: (
    token: string,
    body: { propertyId: string; rating: number; comment: string }
  ) =>
    apiRequest<Review>("/api/reviews", { method: "POST", body, token }),
};

export const landlordService = {
  properties: (token: string) =>
    apiRequest<{ properties: Property[]; meta: PaginationMeta }>(
      "/api/landlord/properties",
      { token }
    ),

  createProperty: (token: string, body: Record<string, unknown>) =>
    apiRequest<Property>("/api/landlord/properties", {
      method: "POST",
      body,
      token,
    }),

  updateProperty: (token: string, id: string, body: Record<string, unknown>) =>
    apiRequest<Property>(`/api/landlord/properties/${id}`, {
      method: "PUT",
      body,
      token,
    }),

  deleteProperty: (token: string, id: string) =>
    apiRequest<Property>(`/api/landlord/properties/${id}`, {
      method: "DELETE",
      token,
    }),

  requests: (token: string, params?: Record<string, string | undefined>) => {
    const qs = buildQuery(params);
    return apiRequest<{ rentals: RentalRequest[]; meta: PaginationMeta }>(
      `/api/landlord/requests${qs ? `?${qs}` : ""}`,
      { token }
    );
  },

  updateRequest: (
    token: string,
    id: string,
    body: { status: "APPROVED" | "REJECTED" | "COMPLETED" }
  ) =>
    apiRequest<RentalRequest>(`/api/landlord/requests/${id}`, {
      method: "PATCH",
      body,
      token,
    }),
};

export const adminService = {
  stats: (token: string) =>
    apiRequest<AdminStats>("/api/admin/stats", { token }),

  users: (token: string, params?: Record<string, string | undefined>) => {
    const qs = buildQuery(params);
    return apiRequest<{ users: User[]; meta: PaginationMeta }>(
      `/api/admin/users${qs ? `?${qs}` : ""}`,
      { token }
    );
  },

  updateUser: (token: string, id: string, body: { isDeleted: boolean }) =>
    apiRequest<User>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body,
      token,
    }),

  properties: (token: string, params?: Record<string, string | undefined>) => {
    const qs = buildQuery(params);
    return apiRequest<{ properties: Property[]; meta: PaginationMeta }>(
      `/api/admin/properties${qs ? `?${qs}` : ""}`,
      { token }
    );
  },

  rentals: (token: string, params?: Record<string, string | undefined>) => {
    const qs = buildQuery(params);
    return apiRequest<{ rentals: RentalRequest[]; meta: PaginationMeta }>(
      `/api/admin/rentals${qs ? `?${qs}` : ""}`,
      { token }
    );
  },
};
