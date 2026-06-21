"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { engagementService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, EmptyState, ErrorState } from "@/components/ui/states";
import { PostCard } from "@/components/post/post-card";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedPage() {
  const { data, isLoading, isError, refetch, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: queryKeys.savedPosts,
    queryFn: ({ pageParam }) => engagementService.getSavedPosts(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length + 1 : undefined),
  });
  
  if (isLoading) return <PageSpinner label="Loading saved posts..." />;
  if (isError) return <ErrorState description="Could not load saved posts." onRetry={() => refetch()} />;
  
  const posts = data?.pages.flatMap((p) => p.results) ?? [];
  
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<Bookmark className="h-5 w-5" />}
        title="No saved posts"
        description="Posts you save will appear here."
      />
    );
  }
  
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-3 py-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasNextPage && (
        <Button variant="outline" fullWidth onClick={() => fetchNextPage()}>
          Load more
        </Button>
      )}
    </div>
  );
}