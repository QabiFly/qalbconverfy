import { apiGet, apiPatch, apiPost, apiDelete } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { UserProfile, Device } from "@/types";

export const userService = {
  getMyProfile(): Promise < UserProfile > {
    return apiGet < UserProfile > (ENDPOINTS.myProfile());
  },
  
  updateMyProfile(payload: Partial < { bio: string;privacy: string } > ): Promise < UserProfile > {
    return apiPatch < UserProfile > (ENDPOINTS.myProfile(), payload);
  },
  
  getPublicProfile(username: string): Promise < UserProfile > {
    return apiGet < UserProfile > (ENDPOINTS.publicProfile(username));
  },
  
  getMyDevices(): Promise < Device[] > {
    return apiGet < Device[] > (ENDPOINTS.myDevices());
  },
  
  deleteDevice(deviceId: string): Promise < void > {
    return apiDelete(ENDPOINTS.deviceDelete(deviceId));
  },
  
  checkUsernameEligibility(username: string): Promise < { available: boolean;reason ? : string } > {
    return apiGet(ENDPOINTS.usernameEligibility(), { params: { username } });
  },
  
  changeUsername(newUsername: string): Promise < UserProfile > {
    return apiPost < UserProfile > (ENDPOINTS.usernameChange(), { username: newUsername });
  },
  
  requestSubdomain(slug: string): Promise < { status: string;slug: string } > {
    return apiPost(ENDPOINTS.subdomainRequest(), { slug });
  },
  
  reviewSubdomainRequest(
    requestId: string,
    decision: "approved" | "rejected"
  ): Promise < void > {
    return apiPost(ENDPOINTS.subdomainRequestReview(requestId), { decision });
  },
};