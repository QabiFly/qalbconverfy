import { UserMini } from "./user";

export type StoryMediaType = "image" | "video";

export interface Story {
  id: string;
  owner: UserMini;
  media_type: StoryMediaType;
  media_url: string;
  duration_seconds ? : number;
  caption ? : string;
  view_count ? : number;
  expires_at ? : string;
  has_viewed ? : boolean;
  created_at ? : string;
}

export interface StoryViewer {
  id: string;
  viewer: UserMini;
  viewed_at ? : string;
}