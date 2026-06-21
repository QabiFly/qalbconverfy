import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Comment, CommentReply, OffsetPage, PostListItem } from "@/types";

export const engagementService = {
  likePost(slug: string): Promise < void > {
    return apiPost(ENDPOINTS.likeToggle(slug));
  },
  unlikePost(slug: string): Promise < void > {
    return apiDelete(ENDPOINTS.likeToggle(slug));
  },
  savePost(slug: string): Promise < void > {
    return apiPost(ENDPOINTS.saveToggle(slug));
  },
  unsavePost(slug: string): Promise < void > {
    return apiDelete(ENDPOINTS.saveToggle(slug));
  },
  sharePost(slug: string, destination: "internal" | "external" = "external"): Promise < void > {
    return apiPost(ENDPOINTS.shareRecord(slug), { destination });
  },
  getSavedPosts(page = 1): Promise < OffsetPage < PostListItem >> {
    return apiGet < OffsetPage < PostListItem >> (ENDPOINTS.savedPosts(), { params: { page } });
  },
  getComments(slug: string, page = 1): Promise < OffsetPage < Comment >> {
    return apiGet < OffsetPage < Comment >> (ENDPOINTS.comments(slug), { params: { page } });
  },
  createComment(slug: string, body: string): Promise < Comment > {
    return apiPost < Comment > (ENDPOINTS.comments(slug), { body });
  },
  updateComment(commentId: string, body: string): Promise < Comment > {
    return apiPatch < Comment > (ENDPOINTS.commentDetail(commentId), { body });
  },
  deleteComment(commentId: string): Promise < void > {
    return apiDelete(ENDPOINTS.commentDetail(commentId));
  },
  getReplies(commentId: string, page = 1): Promise < OffsetPage < CommentReply >> {
    return apiGet < OffsetPage < CommentReply >> (ENDPOINTS.replies(commentId), { params: { page } });
  },
  createReply(commentId: string, body: string): Promise < CommentReply > {
    return apiPost < CommentReply > (ENDPOINTS.replies(commentId), { body });
  },
  updateReply(replyId: string, body: string): Promise < CommentReply > {
    return apiPatch < CommentReply > (ENDPOINTS.replyDetail(replyId), { body });
  },
  deleteReply(replyId: string): Promise < void > {
    return apiDelete(ENDPOINTS.replyDetail(replyId));
  },
};