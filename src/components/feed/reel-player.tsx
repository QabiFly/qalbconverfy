"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { PostListItem } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { APP_ROUTES } from "@/constants/app-routes";
import { engagementService } from "@/lib/api/services";
import { cn } from "@/lib/cn";

export function ReelPlayer({ post }: { post: PostListItem }) {
  const [isLiked, setIsLiked] = useState(Boolean(post.is_liked));
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0);
  
  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked ? engagementService.unlikePost(post.public_slug) : engagementService.likePost(post.public_slug),
    onMutate: () => {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
  });
  
  const playbackUrl = post.primary_media?.playback_url;
  
  return (
    <section className="relative flex h-[calc(100vh-56px)] w-full flex-shrink-0 snap-start items-center justify-center bg-black lg:h-screen">
      {playbackUrl ? (
        <video
          src={playbackUrl}
          poster={post.primary_media?.poster_url || post.thumbnail_url}
          className="h-full w-full object-contain"
          loop
          muted
          playsInline
          controls
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-text-tertiary text-sm">
          No video available
        </div>
      )}

      <div className="absolute bottom-6 left-4 right-16 flex items-center gap-2 text-white">
        <Avatar src={post.owner.avatar_url} username={post.owner.username} size="sm" />
        <Link href={APP_ROUTES.userProfile(post.owner.username)} className="text-sm font-semibold hover:underline">
          @{post.owner.username}
        </Link>
      </div>

      {post.caption && (
        <p className="absolute bottom-16 left-4 right-16 text-sm text-white">{post.caption}</p>
      )}

      <div className="absolute bottom-20 right-3 flex flex-col items-center gap-5 text-white">
        <button onClick={() => likeMutation.mutate()} className="flex flex-col items-center gap-1">
          <Heart className={cn("h-7 w-7", isLiked ? "fill-danger text-danger" : "text-white")} />
          <span className="text-xs">{likeCount}</span>
        </button>
        <Link href={APP_ROUTES.postDetail(post.public_slug)} className="flex flex-col items-center gap-1">
          <MessageCircle className="h-7 w-7" />
          <span className="text-xs">{post.comment_count ?? 0}</span>
        </Link>
        <button onClick={() => engagementService.sharePost(post.public_slug, "external")}>
          <Share2 className="h-7 w-7" />
        </button>
      </div>
    </section>
  );
}