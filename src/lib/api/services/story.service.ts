import { apiGet, apiPost, apiDelete } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Story, StoryViewer, OffsetPage } from "@/types";

export const storyService = {
  getFeed(): Promise < { results: Story[] } > {
    return apiGet(ENDPOINTS.storyFeed());
  },
  getUserStories(username: string): Promise < { results: Story[] } > {
    return apiGet(ENDPOINTS.userStories(username));
  },
  createStory(payload: {
    media_type: "image" | "video";
    storage_provider: "cloudinary" | "s3";
    storage_key: string;
    media_url: string;
    duration_seconds ? : number;
    caption ? : string;
  }): Promise < Story > {
    return apiPost < Story > (ENDPOINTS.createStory(), payload);
  },
  deleteStory(storyId: string): Promise < void > {
    return apiDelete(ENDPOINTS.storyDelete(storyId));
  },
  recordView(storyId: string): Promise < void > {
    return apiPost(ENDPOINTS.storyRecordView(storyId));
  },
  getViewers(storyId: string, page = 1): Promise < OffsetPage < StoryViewer >> {
    return apiGet < OffsetPage < StoryViewer >> (ENDPOINTS.storyViewers(storyId), {
      params: { page },
    });
  },
};