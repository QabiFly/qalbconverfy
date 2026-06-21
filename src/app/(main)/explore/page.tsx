"use client";

import { FeedList } from "@/components/feed/feed-list";
import { feedService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";

export default function ExplorePage() {
  return (
    <FeedList
      queryKey={queryKeys.exploreFeed()}
      fetchPage={(cursor) => feedService.getExploreFeed({ cursor })}
      emptyTitle="Nothing to explore yet"
      emptyDescription="Public posts will show up here as they're published."
    />
  );
}