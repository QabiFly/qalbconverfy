"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { feedService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, EmptyState, ErrorState } from "@/components/ui/states";
import { Clapperboard } from "lucide-react";
import { ReelPlayer } from "@/components/feed/reel-player";

export default function ReelsPage() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: queryKeys.reelsFeed,
    queryFn: ({ pageParam }) => feedService.getReelsFeed({ cursor: pageParam as string | null }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
  
  if (isLoading) return <PageSpinner label="Loading reels..." />;
  if (isError) return <ErrorState description="Could not load reels." onRetry={() => refetch()} />;
  
  const reels = data?.pages.flatMap((p) => p.results) ?? [];
  
  if (reels.length === 0) {
    return (
      <EmptyState
        icon={<Clapperboard className="h-5 w-5" />}
        title="No reels yet"
        description="Short videos from creators will appear here."
      />
    );
  }
  
  return (
    <div className="flex h-[calc(100vh-56px)] snap-y snap-mandatory flex-col overflow-y-scroll lg:h-screen">
      {reels.map((post) => (
        <ReelPlayer key={post.id} post={post} />
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} className="snap-start py-6 text-center text-sm text-text-tertiary">
          Loading more...
        </button>
      )}
    </div>
  );
}