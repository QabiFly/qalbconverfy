"use client";

import { FeedList } from "@/components/feed/feed-list";
import { feedService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";

export default function WatchPage() {
  return (
    <FeedList
      queryKey={queryKeys.watchFeed}
      fetchPage={(cursor) => feedService.getWatchFeed({ cursor })}
      emptyTitle="No videos yet"
      emptyDescription="Long-form videos will appear here."
    />
  );
}