"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { postService } from "@/lib/api/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { APP_ROUTES } from "@/constants/app-routes";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/stores/toast-store";
import { PostType, PostVisibility } from "@/types";
import { FeatureUnavailable } from "@/components/ui/feature-unavailable";

/**
 * Media upload (selecting a file, uploading bytes to Cloudinary/S3,
 * obtaining storage_key/playback_url) has NO corresponding endpoint
 * in api_endpoints.txt — POST /api/v1/posts/ only accepts already-
 * uploaded media_items metadata. There is no /posts/upload/ or
 * presigned-URL endpoint listed. Per the build rules, this is
 * surfaced explicitly rather than faked with a mock upload.
 */
export default function CreatePostPage() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [visibility, setVisibility] = useState < PostVisibility > ("public");
  const [postType] = useState < PostType > ("image");
  
  const createMutation = useMutation({
    mutationFn: () =>
      postService.createPost({
        post_type: postType,
        caption,
        visibility,
        media_items: [],
      }),
    onSuccess: (post) => {
      toast.success("Post created");
      router.push(APP_ROUTES.postDetail(post.public_slug));
    },
    onError: (error) => toast.error("Could not create post", extractErrorMessage(error)),
  });
  
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-6 text-lg font-semibold text-text-primary">Create post</h1>

      <FeatureUnavailable feature="Media upload (selecting and uploading photos/videos)" />

      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            placeholder="Write a caption..."
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as PostVisibility)}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="public">Public</option>
            <option value="followers_only">Followers only</option>
            <option value="private">Private</option>
            <option value="unlisted">Unlisted</option>
          </select>
        </div>

        <Button
          isLoading={createMutation.isPending}
          disabled={!caption.trim()}
          onClick={() => createMutation.mutate()}
          fullWidth
          size="lg"
        >
          Publish (text-only, no media)
        </Button>
      </div>
    </div>
  );
}