import { apiGet } from "@/lib/api/http";
import { ENDPOINTS, QUERY_PARAMS } from "@/lib/api/endpoints";
import { CursorPage, PostListItem } from "@/types";

interface CursorParams {
  cursor ? : string | null;
  pageSize ? : number;
}

export const feedService = {
  getHomeFeed(params: CursorParams = {}): Promise < CursorPage < PostListItem >> {
    return apiGet < CursorPage < PostListItem >> (ENDPOINTS.feedHome(), {
      params: {
        [QUERY_PARAMS.cursor]: params.cursor ?? undefined,
        [QUERY_PARAMS.pageSize]: params.pageSize,
      },
    });
  },
  
  getExploreFeed(
    params: CursorParams & { hashtag ? : string } = {}
  ): Promise < CursorPage < PostListItem >> {
    return apiGet < CursorPage < PostListItem >> (ENDPOINTS.feedExplore(), {
      params: {
        [QUERY_PARAMS.cursor]: params.cursor ?? undefined,
        [QUERY_PARAMS.pageSize]: params.pageSize,
        [QUERY_PARAMS.hashtag]: params.hashtag,
      },
    });
  },
  
  getReelsFeed(params: CursorParams = {}): Promise < CursorPage < PostListItem >> {
    return apiGet < CursorPage < PostListItem >> (ENDPOINTS.feedReels(), {
      params: {
        [QUERY_PARAMS.cursor]: params.cursor ?? undefined,
        [QUERY_PARAMS.pageSize]: params.pageSize,
      },
    });
  },
  
  getProfileFeed(
    username: string,
    params: CursorParams = {}
  ): Promise < CursorPage < PostListItem >> {
    return apiGet < CursorPage < PostListItem >> (ENDPOINTS.feedProfile(username), {
      params: {
        [QUERY_PARAMS.cursor]: params.cursor ?? undefined,
        [QUERY_PARAMS.pageSize]: params.pageSize,
      },
    });
  },
  
  getWatchFeed(params: CursorParams = {}): Promise < CursorPage < PostListItem >> {
    return apiGet < CursorPage < PostListItem >> (ENDPOINTS.feedWatch(), {
      params: {
        [QUERY_PARAMS.cursor]: params.cursor ?? undefined,
        [QUERY_PARAMS.pageSize]: params.pageSize,
      },
    });
  },
  
  getRelatedVideos(slug: string): Promise < { results: PostListItem[] } > {
    return apiGet(ENDPOINTS.feedRelatedVideos(slug));
  },
};