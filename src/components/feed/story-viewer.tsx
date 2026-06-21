"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Story } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { storyService } from "@/lib/api/services";

export function StoryViewer({ story, onClose }: { story: Story;onClose: () => void }) {
  useEffect(() => {
    storyService.recordView(story.id).catch(() => undefined);
  }, [story.id]);
  
  if (typeof document === "undefined") return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black">
      <button onClick={onClose} className="absolute right-4 top-4 text-white" aria-label="Close story">
        <X className="h-7 w-7" />
      </button>

      <div className="flex h-full w-full max-w-md flex-col">
        <div className="flex items-center gap-2 p-4 text-white">
          <Avatar src={story.owner.avatar_url} username={story.owner.username} size="sm" />
          <span className="text-sm font-semibold">@{story.owner.username}</span>
        </div>

        <div className="relative flex-1">
          {story.media_type === "video" ? (
            <video src={story.media_url} className="h-full w-full object-contain" autoPlay controls />
          ) : (
            <img src={story.media_url} alt={story.caption ?? ""} className="h-full w-full object-contain" />
          )}
        </div>

        {story.caption && <p className="p-4 text-center text-sm text-white">{story.caption}</p>}
      </div>
    </div>,
    document.body
  );
}