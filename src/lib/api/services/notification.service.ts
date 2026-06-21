import { apiGet, apiPatch, apiPost } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Notification, NotificationPreferences, OffsetPage } from "@/types";

export const notificationService = {
  list(page = 1): Promise < OffsetPage < Notification >> {
    return apiGet < OffsetPage < Notification >> (ENDPOINTS.notifications(), { params: { page } });
  },
  getUnreadCount(): Promise < { unread_count: number } > {
    return apiGet(ENDPOINTS.notificationUnreadCount());
  },
  markRead(notificationId: string): Promise < void > {
    return apiPost(ENDPOINTS.notificationMarkRead(notificationId));
  },
  markAllRead(): Promise < { marked_count: number } > {
    return apiPost(ENDPOINTS.notificationMarkAllRead());
  },
  getPreferences(): Promise < NotificationPreferences > {
    return apiGet < NotificationPreferences > (ENDPOINTS.notificationPreferences());
  },
  updatePreferences(
    payload: Partial < NotificationPreferences >
  ): Promise < NotificationPreferences > {
    return apiPatch < NotificationPreferences > (ENDPOINTS.notificationPreferences(), payload);
  },
};