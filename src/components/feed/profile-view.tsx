"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { userService, followService, postService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, ErrorState, EmptyState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/app-routes";
import { ImageOff } from "lucide-react";
import Image from "next/image";

export function ProfileView({ username, isOwnProfile }: { username: string;isOwnProfile: boolean }) {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [isFollowing, setIsFollowing] = useState < boolean | null > (null);
  
  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.publicProfile(username),
    queryFn: () => userService.getPublicProfile(username),
  });
  
  const followMutation = useMutation({
    mutationFn: () =>
      isFollowing ?? profile?.is_following ?
      followService.unfollow(username) :
      followService.follow(username),
    onSuccess: () => {
      setIsFollowing((prev) => !(prev ?? profile?.is_following));
      queryClient.invalidateQueries({ queryKey: queryKeys.publicProfile(username) });
    },
  });
  
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.userPosts(username),
    queryFn: ({ pageParam }) => postService.getUserPosts(username, { cursor: pageParam as string | null }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
  
  if (isLoading) return <PageSpinner label="Loading profile..." />;
  if (isError || !profile) return <ErrorState description="Could not load this profile." onRetry={() => refetch()} />;
  
  const posts = postsData?.pages.flatMap((p) => p.results) ?? [];
  const followingState = isFollowing ?? profile.is_following ?? false;
  
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="flex items-center gap-5">
        <Avatar src={profile.avatar_url} username={profile.username} size="xl" verificationLevel={profile.verification_level} />
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-text-primary">@{profile.username}</h1>
          {profile.bio && <p className="mt-1 text-sm text-text-secondary">{profile.bio}</p>}
          <div className="mt-3 flex gap-5 text-sm">
            <span><strong className="text-text-primary">{profile.post_count ?? 0}</strong> <span className="text-text-tertiary">posts</span></span>
            <span><strong className="text-text-primary">{profile.follower_count ?? 0}</strong> <span className="text-text-tertiary">followers</span></span>
            <span><strong className="text-text-primary">{profile.following_count ?? 0}</strong> <span className="text-text-tertiary">following</span></span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {isOwnProfile ? (
          <>
            <Link href={APP_ROUTES.settings} className="flex-1">
              <Button variant="secondary" fullWidth>Edit profile</Button>
            </Link>
            <Button variant="outline" onClick={() => logout()}>Log out</Button>
          </>
        ) : (
          <Button
            variant={followingState ? "secondary" : "primary"}
            fullWidth
            isLoading={followMutation.isPending}
            onClick={() => followMutation.mutate()}
          >
            {followingState ? "Following" : "Follow"}
          </Button>
        )}
      </div>

      <div className="mt-8">
        {posts.length === 0 ? (
          <EmptyState icon={<ImageOff className="h-5 w-5" />} title="No posts yet" />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <Link key={post.id} href={APP_ROUTES.postDetail(post.public_slug)} className="relative aspect-square bg-surface-raised">
                  {post.thumbnail_url ? (
                    <Image src={post.thumbnail_url} alt={post.caption ?? ""} fill className="object-cover" sizes="200px" />
                  ) : null}
                </Link>
              ))}
            </div>
            {hasNextPage && (
              <Button variant="outline" fullWidth className="mt-4" onClick={() => fetchNextPage()}>
                Load more
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}