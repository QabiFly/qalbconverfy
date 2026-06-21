"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { hashtagService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { FeedList } from "@/components/feed/feed-list";
import { PageSpinner, ErrorState } from "@/components/ui/states";

export default function HashtagPage() {
  const params = useParams < { name: string } > ();
  const name = params.name;
  
  const { data: hashtag, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.hashtagDetail(name),
    queryFn: () => hashtagService.getDetail(name),
  });
  
  if (isLoading) return <PageSpinner label="Loading hashtag..." />;
  if (isError || !hashtag) return <ErrorState description="This hashtag could not be found." onRetry={() => refetch()} />;
  
  return (
    <div>
      <div className="border-b border-border px-4 py-4">
        <h1 className="text-lg font-semibold text-text-primary">#{hashtag.normalized_name}</h1>
        <p className="text-sm text-text-tertiary">{hashtag.post_count ?? 0} posts</p>
      </div>
      <FeedList
        queryKey={queryKeys.hashtagPosts(name)}
        fetchPage={(cursor) => hashtagService.getPosts(name, { cursor })}
        emptyTitle="No posts yet"
        emptyDescription={`Be the first to post with #${hashtag.normalized_name}.`}
      />
    </div>
  );
}