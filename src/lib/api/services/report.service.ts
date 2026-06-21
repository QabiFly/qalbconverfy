import { apiGet, apiPost } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { OffsetPage } from "@/types";

export type ReportReason = |
  "spam" |
  "harassment" |
  "hate_speech" |
  "nudity" |
  "violence" |
  "misinformation" |
  "intellectual_property" |
  "self_harm" |
  "impersonation" |
  "other";

export interface ReportRecord {
  id: string;
  reason: ReportReason;
  details ? : string;
  status: "open" | "reviewing" | "resolved" | "rejected";
  created_at ? : string;
  reviewed_at ? : string | null;
  resolution_notes ? : string;
}

export const reportService = {
  reportUser(username: string, reason: ReportReason, details = ""): Promise < void > {
    return apiPost(ENDPOINTS.fileUserReport(username), { reason, details });
  },
  reportPost(slug: string, reason: ReportReason, details = ""): Promise < void > {
    return apiPost(ENDPOINTS.filePostReport(slug), { reason, details });
  },
  reportComment(commentId: string, reason: ReportReason, details = ""): Promise < void > {
    return apiPost(ENDPOINTS.fileCommentReport(commentId), { reason, details });
  },
  
  adminListUserReports(page = 1): Promise < OffsetPage < ReportRecord >> {
    return apiGet < OffsetPage < ReportRecord >> (ENDPOINTS.adminUserReports(), { params: { page } });
  },
  adminListPostReports(page = 1): Promise < OffsetPage < ReportRecord >> {
    return apiGet < OffsetPage < ReportRecord >> (ENDPOINTS.adminPostReports(), { params: { page } });
  },
  adminListCommentReports(page = 1): Promise < OffsetPage < ReportRecord >> {
    return apiGet < OffsetPage < ReportRecord >> (ENDPOINTS.adminCommentReports(), {
      params: { page },
    });
  },
  adminReviewUserReport(
    reportId: string,
    status: "reviewing" | "resolved" | "rejected",
    resolutionNotes = ""
  ): Promise < void > {
    return apiPost(ENDPOINTS.adminUserReportReview(reportId), {
      status,
      resolution_notes: resolutionNotes,
    });
  },
  adminReviewPostReport(
    reportId: string,
    status: "reviewing" | "resolved" | "rejected",
    resolutionNotes = ""
  ): Promise < void > {
    return apiPost(ENDPOINTS.adminPostReportReview(reportId), {
      status,
      resolution_notes: resolutionNotes,
    });
  },
  adminReviewCommentReport(
    reportId: string,
    status: "reviewing" | "resolved" | "rejected",
    resolutionNotes = ""
  ): Promise < void > {
    return apiPost(ENDPOINTS.adminCommentReportReview(reportId), {
      status,
      resolution_notes: resolutionNotes,
    });
  },
};