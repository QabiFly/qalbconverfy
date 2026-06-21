import { UserMini } from "./user";

export type NotificationType = |
  "like" |
  "comment" |
  "reply" |
  "follow" |
  "follow_request" |
  "follow_request_accepted" |
  "mention" |
  "system";

export interface Notification {
  id: string;
  actor: UserMini | null;
  notification_type: NotificationType;
  target_content_type ? : string;
  target_content_id ? : string | null;
  message: string;
  is_read: boolean;
  read_at ? : string | null;
  created_at ? : string;
}

export interface NotificationPreferences {
  likes_enabled ? : boolean;
  comments_enabled ? : boolean;
  replies_enabled ? : boolean;
  follows_enabled ? : boolean;
  mentions_enabled ? : boolean;
  system_enabled ? : boolean;
}