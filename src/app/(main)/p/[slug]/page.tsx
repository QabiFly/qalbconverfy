"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService, engagementService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, ErrorState, EmptyState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { APP_ROUTES } from "@/constants/app-routes";
import { Heart, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEffect } from "react";

export default function PostDetailPage() {
  const params = useParams < { slug: string } > ();
  const slug = params.slug;
  const queryClient = useQueryClient();
  const [commentBody, setCommentBody] = useState("");
  
  const { data: post, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: () => postService.getPost(slug),
  });
  
  const { data: comments } = useQuery({
    queryKey: queryKeys.comments(slug),
    queryFn: () => engagementService.getComments(slug),
    enabled: Boolean(post),
  });
  
  useEffect(() => {
    postService.recordView(slug).catch(() => undefined);
  }, [slug]);
  
  const likeMutation = useMutation({
    mutationFn: () =>
      post?.is_liked ? engagementService.unlikePost(slug) : engagementService.likePost(slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.post(slug) }),
  });
  
  const commentMutation = useMutation({
    mutationFn: () => engagementService.createComment(slug, commentBody),
    onSuccess: () => {
      setCommentBody("");
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(slug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.post(slug) });
    },
  });
  
  if (isLoading) return <PageSpinner label="Loading post..." />;
  if (isError || !post) return <ErrorState description="This post could not be found." onRetry={() => refetch()} />;
  
  const media = post.media_items?.[0];
  
  return (
    <div className="mx-auto max-w-2xl px-3 py-4">
      <div className="rounded-2xl border border-border bg-surface shadow-card">
        <div className="flex items-center gap-3 p-3">
          <Avatar src={post.owner.avatar_url} username={post.owner.username} size="sm" />
          <Link href={APP_ROUTES.userProfile(post.owner.username)} className="text-sm font-semibold text-text-primary hover:underline">
            @{post.owner.username}
          </Link>
        </div>

        <div className="relative aspect-square w-full bg-surface-raised">
          {media?.playback_url || post.thumbnail_url ? (
            <Image src={media?.playback_url || post.thumbnail_url || ""} alt={post.caption ?? ""} fill className="object-cover" sizes="700px" />
          ) : (
            <div className="flex h-full items-center justify-center text-text-tertiary text-sm">No media available</div>
          )}
        </div>

        <div className="flex items-center gap-4 p-3">
          <button onClick={() => likeMutation.mutate()}>
            <Heart className={cn("h-6 w-6", post.is_liked ? "fill-danger text-danger" : "text-text-primary")} />
          </button>
          <span className="text-sm text-text-secondary">{post.like_count ?? 0} likes</span>
        </div>

        {post.caption && (
          <p className="px-3 pb-3 text-sm text-text-primary">
            <span className="font-semibold">@{post.owner.username}</span> {post.caption}
          </p>
        )}
      </div>

      <section className="mt-4">
        <h2 className="mb-3 text-sm font-semibold text-text-secondary">Comments</h2>

        {!comments || comments.results.length === 0 ? (
          <EmptyState title="No comments yet" description="Be the first to comment." />
        ) : (
          <div className="flex flex-col gap-3">
            {comments.results.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <Avatar src={comment.author.avatar_url} username={comment.author.username} size="xs" />
                <p className="text-sm text-text-primary">
                  <span className="font-semibold">@{comment.author.username}</span> {comment.body}
                </p>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (commentBody.trim()) commentMutation.mutate();
          }}
          className="mt-4 flex items-center gap-2"
        >
          <Input
            placeholder="Add a comment..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" isLoading={commentMutation.isPending} disabled={!commentBody.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </section>
    </div>
  );
}