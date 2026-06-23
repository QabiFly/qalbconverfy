"use client";

import { useParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { followService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { UserListRow } from "@/components/follow/user-list-row";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, PageSpinner } from "@/components/ui/states";

export default function FollowingPage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.following(username),
    queryFn: ({ pageParam }) => followService.getFollowing(username, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.next ? pages.length + 1 : undefined,
  });

  if (isLoading) return <PageSpinner label="Loading following..." />;
  if (isError) {
    return (
      <ErrorState
        description="Could not load following."
        onRetry={() => refetch()}
      />
    );
  }

  const users = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-4 text-lg font-semibold text-text-primary">
        @{username} following
      </h1>

      {users.length === 0 ? (
        <EmptyState
          icon={<Users className="h-5 w-5" />}
          title="Not following anyone yet"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <UserListRow key={user.id} user={user} />
          ))}

          {hasNextPage && (
            <Button
              variant="outline"
              fullWidth
              isLoading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
