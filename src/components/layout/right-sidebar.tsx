"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { hashtagService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { APP_ROUTES } from "@/constants/app-routes";
import { TrendingUp } from "lucide-react";

export function RightSidebar() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.trendingHashtags,
    queryFn: () => hashtagService.getTrending(),
  });
  
  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 overflow-y-auto border-l border-border px-4 py-5 xl:flex xl:flex-col">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <TrendingUp className="h-4 w-4 text-accent" />
          Trending hashtags
        </div>

        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 animate-pulse rounded-lg bg-surface-raised" />
            ))}
          </div>
        )}

        {!isLoading && data?.results.length === 0 && (
          <p className="text-sm text-text-tertiary">No trending hashtags yet.</p>
        )}

        <ul className="space-y-1">
          {data?.results.slice(0, 8).map((tag) => (
            <li key={tag.hashtag_id}>
              <Link href={APP_ROUTES.hashtag(tag.name)} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-surface-hover">
                <span className="font-medium text-text-primary">#{tag.name}</span>
                <span className="text-xs text-text-tertiary">{tag.recent_count ?? 0}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 px-1 text-xs text-text-tertiary">
        QalbConverfy &copy; {new Date().getFullYear()}
      </p>
    </aside>
  );
}