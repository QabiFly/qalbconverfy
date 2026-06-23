import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { tokenStorage } from "@/lib/api/token-storage";

/**
 * baseURL comes from NEXT_PUBLIC_API_URL, which must be EXACTLY
 * "https://api.qalbconverfy.in" — no path suffix. Every request path
 * is supplied by ENDPOINTS in endpoints.ts, which already includes
 * the full "/api/v1/..." prefix. This file never appends an extra
 * "/api/v1" segment — doing so would double it. There is no code
 * path anywhere in this project that calls
 * "https://api.qalbconverfy.in/api/v1" as a bare endpoint.
 */
function resolveBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (!configured || configured.length === 0) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. It must be exactly https://api.qalbconverfy.in"
    );
  }
  return configured.replace(/\/+$/, "");
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

/**
 * Single-flight token refresh: concurrent 401s share one in-flight
 * refresh call against ENDPOINTS.refresh() ("/api/v1/auth/refresh/",
 * verbatim from api_endpoints.txt) instead of each firing their own.
 */
let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await axios.post<{ data: { access: string; refresh: string } }>(
    `${resolveBaseUrl()}${ENDPOINTS.refresh()}`,
    { refresh: refreshToken }
  );

  const tokens = response.data.data;
  tokenStorage.setTokens(tokens.access, tokens.refresh);
  return tokens.access;
}

const sessionExpiredListeners = new Set<() => void>();

export function onSessionExpired(listener: () => void): () => void {
  sessionExpiredListeners.add(listener);
  return () => sessionExpiredListeners.delete(listener);
}

function broadcastSessionExpired(): void {
  tokenStorage.clearTokens();
  sessionExpiredListeners.forEach((listener) => listener());
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url?.includes(ENDPOINTS.refresh());

    if (!isUnauthorized || !originalRequest || isRefreshCall) {
      return Promise.reject(error);
    }

    if (originalRequest._retried) {
      broadcastSessionExpired();
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccessToken = await refreshPromise;
      originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
      return apiClient(originalRequest);
    } catch (refreshError) {
      broadcastSessionExpired();
      return Promise.reject(refreshError);
    }
  }
);

/**
 * Defensive error envelope type — fields are optional because we
 * cannot guarantee the exact shape of every error response without
 * an OpenAPI contract. extractErrorMessage degrades gracefully if
 * any field is missing rather than throwing.
 */
export interface ApiErrorEnvelope {
  success?: false;
  error?: {
    detail?: string;
    code?: string;
    errors?: Record<string, string[]>;
  };
}

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorEnvelope | undefined;

    if (data?.error?.detail) return data.error.detail;

    if (data?.error?.errors) {
      const errorsObj = data.error.errors;
      const values = Object.values(errorsObj);

      for (const value of values) {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
          return value[0];
        }
      }
    }

    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please check your connection and try again.";
    }
    if (!error.response) {
      return "Could not reach the server. Please check your connection.";
    }
    if (error.response.status === 404) {
      return "This feature is not available yet.";
    }
    return `Something went wrong (${error.response.status}). Please try again.`;
  }

  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}

export function extractFieldErrors(error: unknown): Record<string, string> | null {
  if (!axios.isAxiosError(error)) return null;
  const data = error.response?.data as ApiErrorEnvelope | undefined;
  if (!data?.error?.errors) return null;

  const fieldErrors: Record<string, string> = {};
  for (const [field, messages] of Object.entries(data.error.errors)) {
    if (Array.isArray(messages) && messages.length > 0 && typeof messages[0] === "string") {
      fieldErrors[field] = messages[0];
    }
  }
  return fieldErrors;
}

export type { AxiosRequestConfig };
