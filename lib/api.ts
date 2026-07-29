import { API_BASE_URL } from "./constants";
import { ApiError } from "./api-error";
import type { ApiResponse } from "./types";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  cache?: RequestCache;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token, cache } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new ApiError(
      payload.message || "Request failed",
      response.status,
      payload.errorDetails
    );
  }

  return payload.data as T;
}
