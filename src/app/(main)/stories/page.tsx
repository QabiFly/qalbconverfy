"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storyService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, EmptyState, ErrorState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/avatar";
import { CircleDot } from "lucide-react";
import { StoryViewer } from "@/components/feed/story-viewer";
import { Story } from "@/types";

export default function StoriesPage() {
  const [activeStory, setActiveStory] = useState < Story | null > (null);
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.storyFeed,
    queryFn: () => storyService.getFeed(),
  });
  
  if (isLoading) return <PageSpinner label="Loading stories..." />;
  if (isError) return <ErrorState description="Could not load stories." onRetry={() => refetch()} />;
  
  const stories = data?.results ?? [];
  
  if (stories.length === 0) {
    return (
      <EmptyState
        icon={<CircleDot className="h-5 w-5" />}
        title="No active stories"
        description="Stories from people you follow will appear here."
      />
    );
  }
  
  return (
    <div className="px-4 py-4">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1.5"
          >
            <div className={`rounded-full p-0.5 ${story.has_viewed ? "bg-border" : "bg-accent"}`}>
              <Avatar src={story.owner.avatar_url} username={story.owner.username} size="lg" />
            </div>
            <span className="max-w-[64px] truncate text-xs text-text-secondary">
              @{story.owner.username}
            </span>
          </button>
        ))}
      </div>

      {activeStory && (
        <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />
      )}
    </div>
  );
}