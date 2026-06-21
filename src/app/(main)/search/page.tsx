"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { searchService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { Input } from "@/components/ui/input";
import { PageSpinner, EmptyState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/avatar";
import { PostCard } from "@/components/post/post-card";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/app-routes";
import { cn } from "@/lib/cn";

type Tab = "all" | "users" | "posts" | "hashtags";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState < Tab > ("all");
  
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.searchCombined(query),
    queryFn: () => searchService.searchAll(query),
    enabled: query.trim().length > 0,
  });
  
  return (
    <div className="mx-auto max-w-xl px-4 py-4">
      <Input
        placeholder="Search users, posts, hashtags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="mt-4 flex gap-2">
        {(["all", "users", "posts", "hashtags"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium capitalize",
              tab === t ? "bg-accent text-accent-foreground" : "bg-surface-raised text-text-secondary"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {!query.trim() && (
        <EmptyState
          icon={<SearchIcon className="h-5 w-5" />}
          title="Search QalbConverfy"
          description="Find people, posts, and hashtags."
        />
      )}

      {query.trim() && isLoading && <PageSpinner label="Searching..." />}

      {query.trim() && data && (
        <div className="mt-4 flex flex-col gap-4">
          {(tab === "all" || tab === "users") && data.users.length > 0 && (
            <section>
              {tab === "all" && <h2 className="mb-2 text-sm font-semibold text-text-secondary">Users</h2>}
              <div className="flex flex-col gap-2">
                {data.users.map((user) => (
                  <Link
                    key={user.id}
                    href={APP_ROUTES.userProfile(user.username)}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-hover"
                  >
                    <Avatar src={user.avatar_url} username={user.username} size="sm" />
                    <span className="text-sm font-medium text-text-primary">@{user.username}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(tab === "all" || tab === "hashtags") && data.hashtags.length > 0 && (
            <section>
              {tab === "all" && <h2 className="mb-2 text-sm font-semibold text-text-secondary">Hashtags</h2>}
              <div className="flex flex-col gap-2">
                {data.hashtags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={APP_ROUTES.hashtag(tag.normalized_name)}
                    className="flex items-center justify-between rounded-xl p-2 hover:bg-surface-hover"
                  >
                    <span className="text-sm font-medium text-text-primary">#{tag.normalized_name}</span>
                    <span className="text-xs text-text-tertiary">{tag.post_count ?? 0} posts</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(tab === "all" || tab === "posts") && data.posts.length > 0 && (
            <section>
              {tab === "all" && <h2 className="mb-2 text-sm font-semibold text-text-secondary">Posts</h2>}
              <div className="flex flex-col gap-4">
                {data.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {data.users.length === 0 && data.hashtags.length === 0 && data.posts.length === 0 && (
            <EmptyState title="No results" description={`Nothing matched "${query}".`} />
          )}
        </div>
      )}
    </div>
  );
}