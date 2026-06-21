import { UserMini } from "./user";

export type FollowRequestStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface FollowRequest {
  id: string;
  requester: UserMini;
  target: UserMini;
  status: FollowRequestStatus;
  created_at ? : string;
  resolved_at ? : string | null;
}

export interface BlockedUserEntry {
  id: string;
  blocked: UserMini;
  reason ? : string;
  created_at ? : string;
}

export interface MutedUserEntry {
  id: string;
  muted: UserMini;
  mute_posts ? : boolean;
  mute_notifications ? : boolean;
  created_at ? : string;
}