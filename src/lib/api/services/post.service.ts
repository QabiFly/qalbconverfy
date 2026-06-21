import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/http";
import { ENDPOINTS, QUERY_PARAMS } from "@/lib/api/endpoints";
import { CreatePostPayload, PostDetail, CursorPage, PostListItem } from "@/types";

export const postService = {
  createPost(payload: CreatePostPayload): Promise<PostDetail> {
    return apiPost<PostDetail, CreatePostPayload>(ENDPOINTS.createPost(), payload);
  },

  getPost(slug: string): Promise<PostDetail> {
    return apiGet<PostDetail>(ENDPOINTS.postDetail(slug));
  },

  updatePost(
    slug: string,
    payload: Partial<{ caption: string; visibility: string; comments_enabled: boolean }>
  ): Promise<PostDetail> {
    return apiPatch<PostDetail>(ENDPOINTS.postDetail(slug), payload);
  },

  deletePost(slug: string): Promise<void> {
    return apiDelete(ENDPOINTS.postDetail(slug));
  },

  getUserPosts(
    username: string,
    params: { cursor?: string | null; pageSize?: number } = {}
  ): Promise<CursorPage<PostListItem>> {
    return apiGet<CursorPage<PostListItem>>(ENDPOINTS.userPosts(username), {
      params: {
        [QUERY_PARAMS.cursor]: params.cursor ?? undefined,
        [QUERY_PARAMS.pageSize]: params.pageSize,
      },
    });
  },

  recordView(slug: string): Promise<void> {
    return apiPost(ENDPOINTS.postRecordView(slug));
  },

  watchStart(slug: string): Promise<{ session_token: string }> {
    return apiPost(ENDPOINTS.watchStart(slug));
  },

  watchProgress(sessionToken: string, progressSeconds: number): Promise<void> {
    return apiPost(ENDPOINTS.watchProgress(), {
      session_token: sessionToken,
      progress_seconds: progressSeconds,
    });
  },

  watchComplete(sessionToken: string): Promise<void> {
    return apiPost(ENDPOINTS.watchComplete(), { session_token: sessionToken });
  },

  liveStart(slug: string): Promise<void> {
    return apiPost(ENDPOINTS.liveStart(slug));
  },

  liveEnd(slug: string): Promise<void> {
    return apiPost(ENDPOINTS.liveEnd(slug));
  },
};