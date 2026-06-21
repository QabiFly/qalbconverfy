"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { postService, feedService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, ErrorState } from "@/components/ui/states";
import { PostCard } from "@/components/post/post-card";

export default function WatchDetailPage() {
  const params = useParams < { slug: string } > ();
  const slug = params.slug;
  const sessionTokenRef = useRef < string | null > (null);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { data: post, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.post(slug),
    queryFn: () => postService.getPost(slug),
  });
  
  const { data: related } = useQuery({
    queryKey: queryKeys.relatedVideos(slug),
    queryFn: () => feedService.getRelatedVideos(slug),
  });
  
  const startMutation = useMutation({
    mutationFn: () => postService.watchStart(slug),
    onSuccess: (data) => {
      sessionTokenRef.current = data.session_token;
    },
  });
  
  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
      startMutation.mutate();
      postService.recordView(slug).catch(() => undefined);
    }
  }, [hasStarted, slug, startMutation]);
  
  if (isLoading) return <PageSpinner label="Loading video..." />;
  if (isError || !post) return <ErrorState description="This video could not be loaded." onRetry={() => refetch()} />;
  
  const media = post.media_items?.[0];
  
  return (
    <div className="mx-auto max-w-2xl px-3 py-4">
      <div className="overflow-hidden rounded-2xl bg-black">
        {media?.playback_url ? (
          <video
            src={media.playback_url}
            poster={media.poster_url || post.thumbnail_url}
            className="w-full"
            controls
            onTimeUpdate={(e) => {
              const seconds = Math.floor(e.currentTarget.currentTime);
              if (sessionTokenRef.current && seconds % 10 === 0) {
                postService.watchProgress(sessionTokenRef.current, seconds).catch(() => undefined);
              }
            }}
            onEnded={() => {
              if (sessionTokenRef.current) {
                postService.watchComplete(sessionTokenRef.current).catch(() => undefined);
              }
            }}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center text-text-tertiary text-sm">
            No video available
          </div>
        )}
      </div>

      <h1 className="mt-4 text-lg font-semibold text-text-primary">{post.caption}</h1>

      {related && related.results.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold text-text-secondary">Related videos</h2>
          <div className="flex flex-col gap-4">
            {related.results.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}