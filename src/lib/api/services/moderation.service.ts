import { apiGet, apiPost } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";

export interface BannedWordRecord {
  id: string;
  word: string;
  is_active ? : boolean;
  severity ? : number;
  created_at ? : string;
}

export interface UserStrikeRecord {
  id: string;
  reason: string;
  revoked ? : boolean;
  revoked_at ? : string | null;
  created_at ? : string;
}

/** Every function calls a moderator/staff-only backend endpoint.
 * The backend enforces this — a non-staff call will 403, surfaced via
 * the standard error handling rather than guessed client-side. */
export const moderationService = {
  moderatePost(slug: string, action: "hide" | "remove" | "shadow_hide", reason = ""): Promise < void > {
    return apiPost(ENDPOINTS.moderatePost(slug), { action, reason });
  },
  
  moderateComment(commentId: string, action: "hide" | "remove", reason = ""): Promise < void > {
    return apiPost(ENDPOINTS.moderateComment(commentId), { action, reason });
  },
  
  issueStrike(username: string, reason: string): Promise < UserStrikeRecord > {
    return apiPost < UserStrikeRecord > (ENDPOINTS.issueStrike(username), { reason });
  },
  
  listUserStrikes(username: string): Promise < { results: UserStrikeRecord[] } > {
    return apiGet(ENDPOINTS.userStrikes(username));
  },
  
  revokeStrike(strikeId: string): Promise < void > {
    return apiPost(ENDPOINTS.revokeStrike(strikeId));
  },
  
  suspendAccount(username: string, reason: string, durationDays ? : number): Promise < void > {
    return apiPost(ENDPOINTS.suspendAccount(username), {
      reason,
      duration_days: durationDays ?? null,
    });
  },
  
  reinstateAccount(username: string, reason = ""): Promise < void > {
    return apiPost(ENDPOINTS.reinstateAccount(username), { reason });
  },
  
  listBannedWords(): Promise < { results: BannedWordRecord[] } > {
    return apiGet(ENDPOINTS.bannedWords());
  },
  
  addBannedWord(word: string, severity = 1): Promise < BannedWordRecord > {
    return apiPost < BannedWordRecord > (ENDPOINTS.bannedWords(), { word, severity });
  },
};