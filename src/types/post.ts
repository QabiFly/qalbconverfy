import { UserMini } from "./user";

export type PostType = "image" | "carousel" | "reel" | "short" | "video" | "live";
export type PostVisibility = "public" | "followers_only" | "private" | "unlisted";
export type ModerationStatus = "active" | "hidden" | "reported" | "removed";
export type MediaType = "short_video" | "long_video" | "live_stream";

export interface PostMedia {
  id: string;
  position ? : number;
  storage_provider ? : "cloudinary" | "s3";
  playback_url ? : string;
  hls_manifest_url ? : string;
  poster_url ? : string;
  duration_seconds ? : number | null;
  aspect_ratio ? : string;
  media_type ? : MediaType | "";
  width ? : number | null;
  height ? : number | null;
  alt_text ? : string;
}

export interface LiveSession {
  id: string;
  status ? : "scheduled" | "live" | "ended";
  scheduled_for ? : string | null;
  started_at ? : string | null;
  ended_at ? : string | null;
  peak_viewer_count ? : number;
  current_viewer_count ? : number;
}

export interface PostListItem {
  id: string;
  public_slug: string;
  post_type: PostType;
  owner: UserMini;
  caption ? : string;
  visibility ? : PostVisibility;
  like_count ? : number;
  comment_count ? : number;
  save_count ? : number;
  share_count ? : number;
  view_count ? : number;
  thumbnail_url ? : string;
  primary_media ? : PostMedia | null;
  canonical_url ? : string;
  published_at ? : string | null;
  created_at ? : string;
  is_liked ? : boolean;
  is_saved ? : boolean;
}

export interface PostDetail {
  id: string;
  public_slug: string;
  post_type: PostType;
  owner: UserMini;
  caption ? : string;
  visibility ? : PostVisibility;
  moderation_status ? : ModerationStatus;
  comments_enabled ? : boolean;
  likes_visible ? : boolean;
  like_count ? : number;
  comment_count ? : number;
  save_count ? : number;
  share_count ? : number;
  view_count ? : number;
  location_name ? : string;
  thumbnail_url ? : string;
  canonical_url ? : string;
  media_items ? : PostMedia[];
  live_session ? : LiveSession | null;
  published_at ? : string | null;
  created_at ? : string;
  updated_at ? : string;
  is_liked ? : boolean;
  is_saved ? : boolean;
}

export interface CreatePostMediaInput {
  storage_provider: "cloudinary" | "s3";
  storage_key: string;
  playback_url ? : string;
  hls_manifest_url ? : string;
  poster_url ? : string;
  duration_seconds ? : number;
  aspect_ratio ? : string;
  media_type ? : MediaType | "";
  width ? : number;
  height ? : number;
  alt_text ? : string;
}

export interface CreatePostPayload {
  post_type: PostType;
  caption ? : string;
  visibility ? : PostVisibility;
  location_name ? : string;
  comments_enabled ? : boolean;
  media_items ? : CreatePostMediaInput[];
}