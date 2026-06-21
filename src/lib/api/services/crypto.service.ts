import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  DeviceIdentityKeyRecord,
  EncryptedMessageRecord,
  KeyBundle,
  SignedPreKeyRecord,
} from "@/types";

export const cryptoService = {
  registerIdentityKey(publicKey: string, algorithmVersion: string): Promise < unknown > {
    return apiPost(ENDPOINTS.cryptoIdentityKey(), {
      public_key: publicKey,
      algorithm_version: algorithmVersion,
    });
  },
  
  listDevices(): Promise < { results: DeviceIdentityKeyRecord[] } > {
    return apiGet(ENDPOINTS.cryptoDevices());
  },
  
  registerDevice(payload: {
    device_id: string;
    device_label ? : string;
    public_key: string;
    algorithm_version: string;
  }): Promise < DeviceIdentityKeyRecord > {
    return apiPost < DeviceIdentityKeyRecord > (ENDPOINTS.cryptoDevices(), payload);
  },
  
  revokeDevice(deviceId: string, reason = ""): Promise < void > {
    return apiPost(ENDPOINTS.cryptoRevokeDevice(deviceId), { reason });
  },
  
  rotateSignedPreKey(
    deviceId: string,
    payload: { key_id: number;public_key: string;signature: string;algorithm_version: string }
  ): Promise < SignedPreKeyRecord > {
    return apiPost < SignedPreKeyRecord > (ENDPOINTS.cryptoRotateSignedPreKey(deviceId), payload);
  },
  
  uploadOneTimePreKeys(
    deviceId: string,
    keys: { key_id: number;public_key: string;algorithm_version: string } []
  ): Promise < { uploaded_count: number } > {
    return apiPost(ENDPOINTS.cryptoUploadOneTimePreKeys(deviceId), { keys });
  },
  
  getOneTimePreKeyCount(deviceId: string): Promise < { available_count: number } > {
    return apiGet(ENDPOINTS.cryptoOneTimePreKeyCount(deviceId));
  },
  
  getKeyBundle(username: string): Promise < KeyBundle > {
    return apiGet < KeyBundle > (ENDPOINTS.cryptoKeyBundle(username));
  },
  
  listMessages(
    conversationId: string,
    deviceId: string
  ): Promise < { results: EncryptedMessageRecord[] } > {
    return apiGet(ENDPOINTS.cryptoMessages(conversationId), { params: { device_id: deviceId } });
  },
  
  sendMessage(
    conversationId: string,
    payload: {
      sender_device_id: string;
      recipient_device_id: string;
      ciphertext: string;
      nonce: string;
      algorithm_version: string;
      key_version: number;
      message_type ? : string;
      reply_to_id ? : string | null;
    }
  ): Promise < EncryptedMessageRecord > {
    return apiPost < EncryptedMessageRecord > (ENDPOINTS.cryptoMessages(conversationId), payload);
  },
  
  editMessage(
    messageId: string,
    payload: { ciphertext: string;nonce: string;key_version: number }
  ): Promise < EncryptedMessageRecord > {
    return apiPatch < EncryptedMessageRecord > (ENDPOINTS.cryptoMessageDetail(messageId), payload);
  },
  
  deleteMessage(messageId: string, scope: "for_me" | "for_everyone"): Promise < void > {
    return apiDelete(ENDPOINTS.cryptoMessageDetail(messageId), { data: { scope } });
  },
  
  markDelivered(messageId: string): Promise < void > {
    return apiPost(ENDPOINTS.cryptoMarkDelivered(messageId));
  },
  
  markRead(messageId: string): Promise < void > {
    return apiPost(ENDPOINTS.cryptoMarkRead(messageId));
  },
  
  react(messageId: string, emoji: string): Promise < void > {
    return apiPost(ENDPOINTS.cryptoReactToMessage(messageId), { emoji });
  },
  
  removeReaction(messageId: string, emoji: string): Promise < void > {
    return apiDelete(ENDPOINTS.cryptoReactToMessage(messageId), { data: { emoji } });
  },
  
  forwardMessage(
    messageId: string,
    payload: {
      target_conversation_id: string;
      sender_device_id: string;
      recipient_device_id: string;
      ciphertext: string;
      nonce: string;
      algorithm_version: string;
      key_version: number;
    }
  ): Promise < EncryptedMessageRecord > {
    return apiPost < EncryptedMessageRecord > (ENDPOINTS.cryptoForwardMessage(messageId), payload);
  },
  
  pinMessage(messageId: string): Promise < void > {
    return apiPost(ENDPOINTS.cryptoPinMessage(messageId));
  },
  
  unpinMessage(messageId: string): Promise < void > {
    return apiDelete(ENDPOINTS.cryptoPinMessage(messageId));
  },
  
  getPinnedMessages(conversationId: string): Promise < { results: unknown[] } > {
    return apiGet(ENDPOINTS.cryptoPinned(conversationId));
  },
  
  setDisappearing(conversationId: string, ttlSeconds: number | null): Promise < void > {
    return apiPatch(ENDPOINTS.cryptoDisappearing(conversationId), { ttl_seconds: ttlSeconds });
  },
  
  heartbeat(): Promise < void > {
    return apiPost(ENDPOINTS.cryptoPresenceHeartbeat());
  },
  
  getUserPresence(username: string): Promise < {
    user_id: string;
    is_online: boolean;
    last_seen: number | null;
  } > {
    return apiGet(ENDPOINTS.cryptoUserPresence(username));
  },
  
  setTyping(conversationId: string, isTyping: boolean): Promise < void > {
    return apiPost(ENDPOINTS.cryptoTyping(conversationId), { is_typing: isTyping });
  },
  
  getTypingUsers(conversationId: string): Promise < { typing_user_ids: string[] } > {
    return apiGet(ENDPOINTS.cryptoTyping(conversationId));
  },
};