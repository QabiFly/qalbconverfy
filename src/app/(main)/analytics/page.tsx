"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { PageSpinner, EmptyState, ErrorState } from "@/components/ui/states";
import { BarChart3 } from "lucide-react";
import { format, subDays } from "date-fns";

export default function AnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const [startDate] = useState(format(subDays(new Date(), 30), "yyyy-MM-dd"));
  const [endDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: user ? queryKeys.userMetrics(user.username, startDate, endDate) : ["analytics", "disabled"],
    queryFn: () => analyticsService.getUserMetrics(user!.username, startDate, endDate),
    enabled: Boolean(user),
  });

  if (!user || isLoading) return <PageSpinner label="Loading analytics..." />;
  if (isError) return <ErrorState description="Could not load analytics." onRetry={() => refetch()} />;

  const rows = data?.results ?? [];

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="h-5 w-5" />}
        title="No analytics yet"
        description="Data will appear here once you have activity on your account."
      />
    );
  }

  const totals = rows.reduce(
    (acc, row) => ({
      newFollowers: acc.newFollowers + (row.new_followers ?? 0),
      postsCreated: acc.postsCreated + (row.posts_created ?? 0),
      viewsReceived: acc.viewsReceived + (row.total_views_received ?? 0),
      likesReceived: acc.likesReceived + (row.total_likes_received ?? 0),
    }),
    { newFollowers: 0, postsCreated: 0, viewsReceived: 0, likesReceived: 0 }
  );

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-6 text-lg font-semibold text-text-primary">Analytics — last 30 days</h1>

      <div className="grid grid-cols-2 gap-3">
        {[
          ["New followers", totals.newFollowers],
          ["Posts created", totals.postsCreated],
          ["Views received", totals.viewsReceived],
          ["Likes received", totals.likesReceived],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold text-text-primary">{value as number}</p>
            <p className="text-xs text-text-tertiary">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}