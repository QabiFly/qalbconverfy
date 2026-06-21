import { apiGet, apiPost } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  FollowRequest,
  BlockedUserEntry,
  MutedUserEntry,
  OffsetPage,
  UserMini,
} from "@/types";

export const followService = {
  follow(username: string): Promise < { status ? : string } > {
    return apiPost(ENDPOINTS.follow(), { username });
  },
  unfollow(username: string): Promise < void > {
    return apiPost(ENDPOINTS.unfollow(), { username });
  },
  getPendingRequests(page = 1): Promise < OffsetPage < FollowRequest >> {
    return apiGet < OffsetPage < FollowRequest >> (ENDPOINTS.pendingFollowRequests(), {
      params: { page },
    });
  },
  acceptRequest(requestId: string): Promise < void > {
    return apiPost(ENDPOINTS.acceptFollowRequest(requestId));
  },
  rejectRequest(requestId: string): Promise < void > {
    return apiPost(ENDPOINTS.rejectFollowRequest(requestId));
  },
  getFollowers(username: string, page = 1): Promise < OffsetPage < UserMini >> {
    return apiGet < OffsetPage < UserMini >> (ENDPOINTS.followers(username), { params: { page } });
  },
  getFollowing(username: string, page = 1): Promise < OffsetPage < UserMini >> {
    return apiGet < OffsetPage < UserMini >> (ENDPOINTS.following(username), { params: { page } });
  },
  block(username: string, reason = ""): Promise < void > {
    return apiPost(ENDPOINTS.followsBlock(), { username, reason });
  },
  unblock(username: string): Promise < void > {
    return apiPost(ENDPOINTS.followsUnblock(), { username });
  },
  getBlockedUsers(page = 1): Promise < OffsetPage < BlockedUserEntry >> {
    return apiGet < OffsetPage < BlockedUserEntry >> (ENDPOINTS.followsBlockedList(), {
      params: { page },
    });
  },
  mute(
    username: string,
    options: { mutePosts ? : boolean;muteNotifications ? : boolean } = {}
  ): Promise < void > {
    return apiPost(ENDPOINTS.followsMute(), {
      username,
      mute_posts: options.mutePosts ?? true,
      mute_notifications: options.muteNotifications ?? true,
    });
  },
  unmute(username: string): Promise < void > {
    return apiPost(ENDPOINTS.followsUnmute(), { username });
  },
  getMutedUsers(page = 1): Promise < OffsetPage < MutedUserEntry >> {
    return apiGet < OffsetPage < MutedUserEntry >> (ENDPOINTS.followsMutedList(), {
      params: { page },
    });
  },
};