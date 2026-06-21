"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationService, messagingService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/stores/auth-store";

const POLL_INTERVAL_MS = 30_000;

export function useUnreadNotificationCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  return useQuery({
    queryKey: queryKeys.notificationUnreadCount,
    queryFn: () => notificationService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: POLL_INTERVAL_MS,
    select: (data) => data.unread_count,
  });
}

export function useUnreadMessageCount() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  
  return useQuery({
    queryKey: queryKeys.messagingUnreadCount,
    queryFn: () => messagingService.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: POLL_INTERVAL_MS,
    select: (data) => data.unread_count,
  });
}