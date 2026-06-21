import { apiGet, apiPost, apiDelete } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Conversation, Message, OffsetPage } from "@/types";

export const messagingService = {
  getConversations(page = 1): Promise < OffsetPage < Conversation >> {
    return apiGet < OffsetPage < Conversation >> (ENDPOINTS.conversations(), { params: { page } });
  },
  startDirectConversation(username: string): Promise < Conversation > {
    return apiPost < Conversation > (ENDPOINTS.startDirectConversation(), { username });
  },
  startGroupConversation(usernames: string[], title = ""): Promise < Conversation > {
    return apiPost < Conversation > (ENDPOINTS.startGroupConversation(), { usernames, title });
  },
  getConversation(conversationId: string): Promise < Conversation > {
    return apiGet < Conversation > (ENDPOINTS.conversationDetail(conversationId));
  },
  leaveConversation(conversationId: string): Promise < void > {
    return apiPost(ENDPOINTS.leaveConversation(conversationId));
  },
  getMessages(conversationId: string, page = 1): Promise < OffsetPage < Message >> {
    return apiGet < OffsetPage < Message >> (ENDPOINTS.conversationMessages(conversationId), {
      params: { page },
    });
  },
  sendMessage(
    conversationId: string,
    payload: { body ? : string;message_type ? : string;shared_post_slug ? : string }
  ): Promise < Message > {
    return apiPost < Message > (ENDPOINTS.conversationMessages(conversationId), payload);
  },
  markConversationRead(conversationId: string): Promise < { marked_count: number } > {
    return apiPost(ENDPOINTS.markConversationRead(conversationId));
  },
  markMessageRead(messageId: string): Promise < void > {
    return apiPost(ENDPOINTS.markMessageRead(messageId));
  },
  deleteMessage(messageId: string): Promise < void > {
    return apiDelete(ENDPOINTS.deleteMessage(messageId));
  },
  getUnreadCount(): Promise < { unread_count: number } > {
    return apiGet(ENDPOINTS.messagingUnreadCount());
  },
};