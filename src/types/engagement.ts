import { UserMini } from "./user";

export interface CommentReply {
  id: string;
  comment ? : string;
  author: UserMini;
  body: string;
  like_count ? : number;
  edited_at ? : string | null;
  created_at ? : string;
}

export interface Comment {
  id: string;
  post ? : string;
  author: UserMini;
  body: string;
  like_count ? : number;
  reply_count ? : number;
  edited_at ? : string | null;
  created_at ? : string;
  replies_preview ? : CommentReply[];
}