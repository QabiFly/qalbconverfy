"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { messagingService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, EmptyState, ErrorState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/avatar";
import { APP_ROUTES } from "@/constants/app-routes";
import { MessageCircle, PenLine } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export default function MessagesPage() {
  const currentUser = useAuthStore((s) => s.user);
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => messagingService.getConversations(),
  });
  
  if (isLoading) return <PageSpinner label="Loading conversations..." />;
  if (isError) return <ErrorState description="Could not load conversations." onRetry={() => refetch()} />;
  
  const conversations = data?.results ?? [];
  
  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle className="h-5 w-5" />}
        title="No conversations yet"
        description="Start a direct message from someone's profile or create a new chat."
        action={
          <Link
            href={APP_ROUTES.newMessage}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-accent-foreground"
          >
            <PenLine className="h-4 w-4" />
            New message
          </Link>
        }
      />
    );
  }
  
  return (
    <div className="mx-auto max-w-xl px-2 py-4">
      <div className="mb-3 flex items-center justify-between px-2">
        <h1 className="text-lg font-semibold text-text-primary">Messages</h1>
        <Link
          href={APP_ROUTES.newMessage}
          className="inline-flex h-9 items-center gap-2 rounded-xl border border-border bg-surface-raised px-3 text-sm text-text-primary hover:bg-surface-hover"
        >
          <PenLine className="h-4 w-4" />
          New
        </Link>
      </div>
      <div className="flex flex-col">
        {conversations.map((conv) => {
          const otherParticipant = conv.participants?.find((p) => p.user.id !== currentUser?.id)?.user;
          const displayName = conv.conversation_type === "group" ? conv.title || "Group" : otherParticipant?.username;

          return (
            <Link
              key={conv.id}
              href={APP_ROUTES.conversation(conv.id)}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface-hover"
            >
              <Avatar
                src={otherParticipant?.avatar_url ?? null}
                username={displayName ?? "?"}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  {conv.conversation_type === "group" ? displayName : `@${displayName}`}
                </p>
                {conv.last_message && (
                  <p className="truncate text-xs text-text-tertiary">{conv.last_message.body}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}