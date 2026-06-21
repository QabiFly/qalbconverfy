import { apiGet } from "@/lib/api/http";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { DailyPostMetrics, DailyUserMetrics } from "@/types";

export const analyticsService = {
  getPostMetrics(
    slug: string,
    startDate: string,
    endDate: string
  ): Promise < { results: DailyPostMetrics[] } > {
    return apiGet(ENDPOINTS.postMetrics(slug), {
      params: { start_date: startDate, end_date: endDate },
    });
  },
  getUserMetrics(
    username: string,
    startDate: string,
    endDate: string
  ): Promise < { results: DailyUserMetrics[] } > {
    return apiGet(ENDPOINTS.userMetrics(username), {
      params: { start_date: startDate, end_date: endDate },
    });
  },
};

export interface HealthStatus {
  status: string;
  [key: string]: unknown;
}

export const healthService = {
  async check(): Promise < HealthStatus > {
    const response = await apiClient.get(ENDPOINTS.health());
    return response.data?.data ?? response.data;
  },
};