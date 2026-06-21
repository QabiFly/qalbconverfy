import { UserMini } from "./user";
import { PostListItem } from "./post";

export interface Hashtag {
  id: string;
  normalized_name: string;
  post_count ? : number;
  created_at ? : string;
}

export interface TrendingHashtag {
  hashtag_id: string;
  name: string;
  recent_count ? : number;
}

export interface CombinedSearchResults {
  users: UserMini[];
  hashtags: Hashtag[];
  posts: PostListItem[];
}

export interface DailyPostMetrics {
  date: string;
  views ? : number;
  unique_viewers ? : number;
  total_watch_time_seconds ? : number;
  likes ? : number;
  comments ? : number;
  shares ? : number;
  saves ? : number;
}

export interface DailyUserMetrics {
  date: string;
  new_followers ? : number;
  lost_followers ? : number;
  posts_created ? : number;
  total_views_received ? : number;
  total_likes_received ? : number;
  total_comments_received ? : number;
  follower_count_snapshot ? : number;
}