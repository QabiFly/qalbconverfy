import { apiGet, apiPost, apiDelete } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { Session } from "@/types";

export const sessionService = {
  list(): Promise<Session[]> {
    return apiGet<Session[]>(ENDPOINTS.mySessions());
  },
  revoke(sessionId: string): Promise<void> {
    return apiDelete(ENDPOINTS.sessionRevoke(sessionId));
  },
  revokeAll(): Promise<void> {
    return apiPost(ENDPOINTS.revokeAllSessions());
  },
};

export interface AuditLogEntry {
  id: string;
  event_type: string;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface LoginAuditLogEntry {
  id: string;
  ip_address?: string;
  user_agent?: string;
  was_successful?: boolean;
  created_at?: string;
}

export const auditLogService = {
  listAll(page = 1): Promise<{ results: AuditLogEntry[]; count?: number }> {
    return apiGet(ENDPOINTS.auditLogs(), { params: { page } });
  },
  listLoginAttempts(page = 1): Promise<{ results: LoginAuditLogEntry[]; count?: number }> {
    return apiGet(ENDPOINTS.loginAuditLogs(), { params: { page } });
  },
  getMyAuditLog(page = 1): Promise<{ results: AuditLogEntry[]; count?: number }> {
    return apiGet(ENDPOINTS.myAuditLog(), { params: { page } });
  },
};