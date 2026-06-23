"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Search, Users } from "lucide-react";

import { APP_ROUTES } from "@/constants/app-routes";
import { messagingService, searchService } from "@/lib/api/services";
import { extractErrorMessage } from "@/lib/api/client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, PageSpinner } from "@/components/ui/states";
import { toast } from "@/stores/toast-store";

export default function NewMessagePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["messages", "new", "search-users", query],
    queryFn: () => searchService.searchUsers(query, 20),
    enabled: query.trim().length >= 2,
  });

  const startMutation = useMutation({
    mutationFn: (username: string) =>
      messagingService.startDirectConversation(username),
    onSuccess: (conversation) => {
      router.push(APP_ROUTES.conversation(conversation.id));
    },
    onError: (error) => {
      toast.error("Could not start chat", extractErrorMessage(error));
    },
  });

  const users = data?.results ?? [];

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-4 text-lg font-semibold text-text-primary">
        New message
      </h1>

      <Input
        label="Search users"
        placeholder="Type a username..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="mt-5">
        {query.trim().length < 2 ? (
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="Search for someone"
            description="Type at least 2 characters to start a conversation."
          />
        ) : isLoading ? (
          <PageSpinner label="Searching users..." />
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="h-5 w-5" />}
            title="No users found"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3"
              >
                <Avatar
                  src={user.avatar_url}
                  username={user.username}
                  size="md"
                  verificationLevel={user.verification_level}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    @{user.username}
                  </p>
                  {user.profile_slug && (
                    <p className="truncate text-xs text-text-tertiary">
                      {user.profile_slug}
                    </p>
                  )}
                </div>

                <Button
                  size="sm"
                  isLoading={startMutation.isPending}
                  onClick={() => startMutation.mutate(user.username)}
                >
                  Message
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
