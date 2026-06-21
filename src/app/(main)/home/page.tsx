"use client";

import { FeedList } from "@/components/feed/feed-list";
import { feedService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";

export default function HomePage() {
  return (
    <FeedList
      queryKey={queryKeys.homeFeed}
      fetchPage={(cursor) => feedService.getHomeFeed({ cursor })}
      emptyTitle="Your feed is empty"
      emptyDescription="Follow people to see their posts here."
    />
  );
}