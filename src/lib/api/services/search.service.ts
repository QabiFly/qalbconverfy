import { apiGet } from "@/lib/api/http";
import { ENDPOINTS } from "@/lib/api/endpoints";
import {
  CombinedSearchResults,
  Hashtag,
  TrendingHashtag,
  UserMini,
  PostListItem,
  CursorPage,
} from "@/types";

export const searchService = {
  searchAll(query: string): Promise < CombinedSearchResults > {
    return apiGet < CombinedSearchResults > (ENDPOINTS.searchCombined(), { params: { q: query } });
  },
  searchUsers(query: string, limit = 20): Promise < { results: UserMini[] } > {
    return apiGet(ENDPOINTS.searchUsers(), { params: { q: query, limit } });
  },
  searchHashtags(query: string, limit = 20): Promise < { results: Hashtag[] } > {
    return apiGet(ENDPOINTS.searchHashtags(), { params: { q: query, limit } });
  },
  searchPosts(query: string, limit = 20): Promise < { results: PostListItem[] } > {
    return apiGet(ENDPOINTS.searchPosts(), { params: { q: query, limit } });
  },
};

export const hashtagService = {
  getDetail(name: string): Promise < Hashtag > {
    return apiGet < Hashtag > (ENDPOINTS.hashtagDetail(name));
  },
  getPosts(
    name: string,
    params: { cursor ? : string | null;pageSize ? : number } = {}
  ): Promise < CursorPage < PostListItem >> {
    return apiGet < CursorPage < PostListItem >> (ENDPOINTS.hashtagPosts(name), {
      params: { cursor: params.cursor ?? undefined, page_size: params.pageSize },
    });
  },
  getTrending(): Promise < { results: TrendingHashtag[] } > {
    return apiGet(ENDPOINTS.trendingHashtags());
  },
};