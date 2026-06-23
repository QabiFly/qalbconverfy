"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ImageOff, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { APP_ROUTES } from "@/constants/app-routes";
import { queryKeys } from "@/constants/query-keys";
import {
  followService,
  messagingService,
  postService,
  userService,
} from "@/lib/api/services";
import { useAuth } from "@/providers/auth-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, PageSpinner } from "@/components/ui/states";
import { toast } from "@/stores/toast-store";
import { extractErrorMessage } from "@/lib/api/client";

export function ProfileView({
  username,
  isOwnProfile,
}: {
  username: string;
  isOwnProfile: boolean;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.publicProfile(username),
    queryFn: () => userService.getPublicProfile(username),
  });

  const followMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const currentFollowState = isFollowing ?? profile?.is_following ?? false;

      if (currentFollowState) {
        await followService.unfollow(username);
        return;
      }

      await followService.follow(username);
    },
    onSuccess: () => {
      setIsFollowing((prev) => !(prev ?? profile?.is_following ?? false));
      queryClient.invalidateQueries({
        queryKey: queryKeys.publicProfile(username),
      });
    },
    onError: (error) => {
      toast.error("Follow action failed", extractErrorMessage(error));
    },
  });

  const messageMutation = useMutation({
    mutationFn: () => messagingService.startDirectConversation(username),
    onSuccess: (conversation) => {
      router.push(APP_ROUTES.conversation(conversation.id));
    },
    onError: (error) => {
      toast.error("Could not start conversation", extractErrorMessage(error));
    },
  });

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.userPosts(username),
    queryFn: ({ pageParam }) =>
      postService.getUserPosts(username, {
        cursor: pageParam as string | null,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });

  if (isLoading) return <PageSpinner label="Loading profile..." />;

  if (isError || !profile) {
    return (
      <ErrorState
        description="Could not load this profile."
        onRetry={() => refetch()}
      />
    );
  }

  const posts = postsData?.pages.flatMap((page) => page.results) ?? [];
  const followingState = isFollowing ?? profile.is_following ?? false;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center gap-5">
        <Avatar
          src={profile.avatar_url}
          username={profile.username}
          size="xl"
          verificationLevel={profile.verification_level}
        />

        <div className="flex-1">
          <h1 className="text-lg font-semibold text-text-primary">
            @{profile.username}
          </h1>

          {profile.bio && (
            <p className="mt-1 text-sm text-text-secondary">{profile.bio}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-5 text-sm">
            <span>
              <strong className="text-text-primary">
                {profile.post_count ?? 0}
              </strong>{" "}
              <span className="text-text-tertiary">posts</span>
            </span>

            <Link href={APP_ROUTES.userFollowers(username)} className="hover:underline">
              <strong className="text-text-primary">
                {profile.follower_count ?? 0}
              </strong>{" "}
              <span className="text-text-tertiary">followers</span>
            </Link>

            <Link href={APP_ROUTES.userFollowing(username)} className="hover:underline">
              <strong className="text-text-primary">
                {profile.following_count ?? 0}
              </strong>{" "}
              <span className="text-text-tertiary">following</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {isOwnProfile ? (
          <>
            <Link href={APP_ROUTES.settings} className="flex-1">
              <Button variant="secondary" fullWidth>
                Edit profile
              </Button>
            </Link>

            <Button variant="outline" onClick={() => logout()}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={followingState ? "secondary" : "primary"}
              fullWidth
              isLoading={followMutation.isPending}
              onClick={() => followMutation.mutate()}
            >
              {followingState ? "Following" : "Follow"}
            </Button>

            <Button
              variant="secondary"
              fullWidth
              isLoading={messageMutation.isPending}
              onClick={() => messageMutation.mutate()}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
          </>
        )}
      </div>

      <div className="mt-8">
        {posts.length === 0 ? (
          <EmptyState
            icon={<ImageOff className="h-5 w-5" />}
            title="No posts yet"
          />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={APP_ROUTES.postDetail(post.public_slug)}
                  className="relative aspect-square bg-surface-raised"
                >
                  {post.thumbnail_url ? (
                    <Image
                      src={post.thumbnail_url}
                      alt={post.caption ?? ""}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  ) : null}
                </Link>
              ))}
            </div>

            {hasNextPage && (
              <Button
                variant="outline"
                fullWidth
                className="mt-4"
                isLoading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                Load more
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
