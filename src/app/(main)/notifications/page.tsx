"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, EmptyState, ErrorState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from "@/lib/cn";
import { Notification } from "@/types";

const NOTIFICATION_TEXT: Record < Notification["notification_type"], string > = {
  like: "liked your post",
  comment: "commented on your post",
  reply: "replied to your comment",
  follow: "started following you",
  follow_request: "requested to follow you",
  follow_request_accepted: "accepted your follow request",
  mention: "mentioned you",
  system: "",
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => notificationService.list(),
  });
  
  const markAllReadMutation = useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationUnreadCount });
    },
  });
  
  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationUnreadCount });
    },
  });
  
  if (isLoading) return <PageSpinner label="Loading notifications..." />;
  if (isError) return <ErrorState description="Could not load notifications." onRetry={() => refetch()} />;
  
  const notifications = data?.results ?? [];
  
  return (
    <div className="mx-auto max-w-xl px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Notifications</h1>
        <Button variant="ghost" size="sm" onClick={() => markAllReadMutation.mutate()}>
          Mark all read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-5 w-5" />} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="flex flex-col gap-1">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.is_read && markReadMutation.mutate(n.id)}
              className={cn(
                "flex items-start gap-3 rounded-xl p-3 text-left hover:bg-surface-hover",
                !n.is_read && "bg-surface-raised"
              )}
            >
              {n.actor ? (
                <Avatar src={n.actor.avatar_url} username={n.actor.username} size="sm" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Bell className="h-4 w-4" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text-primary">
                  {n.actor && <span className="font-semibold">@{n.actor.username}</span>}{" "}
                  {NOTIFICATION_TEXT[n.notification_type] || n.message}
                </p>
                {n.created_at && (
                  <p className="text-xs text-text-tertiary">{new Date(n.created_at).toLocaleString()}</p>
                )}
              </div>
              {!n.is_read && <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}