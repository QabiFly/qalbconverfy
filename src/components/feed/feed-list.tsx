"use client";

import { Fragment } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CursorPage, PostListItem } from "@/types";
import { PostCard } from "@/components/post/post-card";
import { PageSpinner, EmptyState, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";

export function FeedList({
  queryKey,
  fetchPage,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Check back later for new content.",
}: {
  queryKey: readonly unknown[];
  fetchPage: (cursor: string | null) => Promise < CursorPage < PostListItem >> ;
  emptyTitle ? : string;
  emptyDescription ? : string;
}) {
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => fetchPage(pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
  
  if (isLoading) {
    return <PageSpinner label="Loading posts..." />;
  }
  
  if (isError) {
    return <ErrorState description="Could not load this feed." onRetry={() => refetch()} />;
  }
  
  const allPosts = data?.pages.flatMap((page) => page.results) ?? [];
  
  if (allPosts.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="h-5 w-5" />}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }
  
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 px-3 py-4">
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.results.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Fragment>
      ))}

      {hasNextPage && (
        <Button
          variant="outline"
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
          fullWidth
        >
          Load more
        </Button>
      )}
    </div>
  );
}