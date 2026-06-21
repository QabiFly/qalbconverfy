"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { PostListItem } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { APP_ROUTES } from "@/constants/app-routes";
import { engagementService } from "@/lib/api/services";
import { cn } from "@/lib/cn";

export function PostCard({ post }: { post: PostListItem }) {
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(Boolean(post.is_liked));
  const [isSaved, setIsSaved] = useState(Boolean(post.is_saved));
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0);
  
  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked ? engagementService.unlikePost(post.public_slug) : engagementService.likePost(post.public_slug),
    onMutate: () => {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onError: () => {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
    },
  });
  
  const saveMutation = useMutation({
    mutationFn: () =>
      isSaved ? engagementService.unsavePost(post.public_slug) : engagementService.savePost(post.public_slug),
    onMutate: () => setIsSaved((prev) => !prev),
    onError: () => setIsSaved((prev) => !prev),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "saved"] });
    },
  });
  
  const shareMutation = useMutation({
    mutationFn: () => engagementService.sharePost(post.public_slug, "external"),
  });
  
  const mediaUrl = post.primary_media?.playback_url || post.thumbnail_url;
  
  return (
    <article className="rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex items-center gap-3 p-3">
        <Avatar
          src={post.owner.avatar_url}
          username={post.owner.username}
          size="sm"
          verificationLevel={post.owner.verification_level}
        />
        <Link href={APP_ROUTES.userProfile(post.owner.username)} className="text-sm font-semibold text-text-primary hover:underline">
          @{post.owner.username}
        </Link>
      </div>

      <Link href={APP_ROUTES.postDetail(post.public_slug)}>
        <div className="relative aspect-square w-full bg-surface-raised">
          {mediaUrl ? (
            <Image src={mediaUrl} alt={post.caption ?? ""} fill className="object-cover" sizes="600px" />
          ) : (
            <div className="flex h-full items-center justify-center text-text-tertiary text-sm">
              No media available
            </div>
          )}
        </div>
      </Link>

      <div className="flex items-center gap-4 p-3">
        <button onClick={() => likeMutation.mutate()} className="flex items-center gap-1.5" aria-label="Like">
          <Heart className={cn("h-6 w-6", isLiked ? "fill-danger text-danger" : "text-text-primary")} />
          <span className="text-sm text-text-secondary">{likeCount}</span>
        </button>

        <Link href={APP_ROUTES.postDetail(post.public_slug)} className="flex items-center gap-1.5">
          <MessageCircle className="h-6 w-6 text-text-primary" />
          <span className="text-sm text-text-secondary">{post.comment_count ?? 0}</span>
        </Link>

        <button onClick={() => shareMutation.mutate()} aria-label="Share">
          <Share2 className="h-6 w-6 text-text-primary" />
        </button>

        <button onClick={() => saveMutation.mutate()} className="ml-auto" aria-label="Save">
          <Bookmark className={cn("h-6 w-6", isSaved ? "fill-accent text-accent" : "text-text-primary")} />
        </button>
      </div>

      {post.caption && (
        <p className="px-3 pb-3 text-sm text-text-primary">
          <span className="font-semibold">@{post.owner.username}</span> {post.caption}
        </p>
      )}
    </article>
  );
}