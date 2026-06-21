import { apiClient } from "@/lib/api/client";
import { AxiosRequestConfig } from "axios";

/**
 * Every response from this backend is wrapped as
 * { success, data, message? }. Because there is no OpenAPI contract
 * to verify this against, `data.data` is read defensively — if a
 * given endpoint's actual shape ever diverges, TypeScript's generic
 * `T` here is a compile-time assertion only, not a runtime guarantee.
 * Callers that render uncertain fields should still null-check.
 */

export async function apiGet < T > (url: string, config ? : AxiosRequestConfig): Promise < T > {
  const response = await apiClient.get < { data: T } > (url, config);
  return response.data.data;
}

export async function apiPost < T, B = unknown > (
  url: string,
  body ? : B,
  config ? : AxiosRequestConfig
): Promise < T > {
  const response = await apiClient.post < { data: T } > (url, body, config);
  return response.data.data;
}

export async function apiPatch < T, B = unknown > (
  url: string,
  body ? : B,
  config ? : AxiosRequestConfig
): Promise < T > {
  const response = await apiClient.patch < { data: T } > (url, body, config);
  return response.data.data;
}

export async function apiDelete < T = void > (
  url: string,
  config ? : AxiosRequestConfig
): Promise < T > {
  const response = await apiClient.delete < { data: T } > (url, config);
  return response.data.data;
}