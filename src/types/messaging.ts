import { UserMini } from "./user";
import { PostListItem } from "./post";

export type ConversationType = "direct" | "group";
export type MessageType = "text" | "image" | "video" | "post_share";

export interface MessageAttachment {
  id: string;
  media_url: string;
  thumbnail_url ? : string;
  width ? : number | null;
  height ? : number | null;
  duration_seconds ? : number | null;
}

export interface Message {
  id: string;
  conversation ? : string;
  sender: UserMini | null;
  message_type: MessageType;
  body: string;
  shared_post ? : PostListItem | null;
  attachments ? : MessageAttachment[];
  edited_at ? : string | null;
  is_read_by_me ? : boolean;
  created_at ? : string;
}

export interface ConversationParticipant {
  user: UserMini;
  is_muted ? : boolean;
  joined_at ? : string;
  left_at ? : string | null;
}

export interface ConversationLastMessage {
  id: string;
  body: string;
  sender_id: string | null;
}

export interface Conversation {
  id: string;
  conversation_type: ConversationType;
  title ? : string;
  participants ? : ConversationParticipant[];
  last_message ? : ConversationLastMessage | null;
  last_message_at ? : string | null;
  created_at ? : string;
}