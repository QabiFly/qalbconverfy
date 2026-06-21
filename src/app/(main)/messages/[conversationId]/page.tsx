"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagingService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { PageSpinner, ErrorState, EmptyState } from "@/components/ui/states";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/cn";

export default function ConversationDetailPage() {
  const params = useParams < { conversationId: string } > ();
  const conversationId = params.conversationId;
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.conversationMessages(conversationId),
    queryFn: () => messagingService.getMessages(conversationId),
  });
  
  const sendMutation = useMutation({
    mutationFn: () => messagingService.sendMessage(conversationId, { body, message_type: "text" }),
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: queryKeys.conversationMessages(conversationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
  
  if (isLoading) return <PageSpinner label="Loading messages..." />;
  if (isError) return <ErrorState description="Could not load this conversation." onRetry={() => refetch()} />;
  
  const messages = data?.results ?? [];
  
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col lg:h-screen">
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {messages.length === 0 ? (
          <EmptyState title="No messages yet" description="Say hello to start the conversation." />
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => {
              const isMine = message.sender?.id === currentUser?.id;
              return (
                <div key={message.id} className={cn("flex items-end gap-2", isMine && "flex-row-reverse")}>
                  {!isMine && message.sender && (
                    <Avatar src={message.sender.avatar_url} username={message.sender.username} size="xs" />
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                      isMine ? "bg-accent text-accent-foreground" : "bg-surface-raised text-text-primary"
                    )}
                  >
                    {message.body}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (body.trim()) sendMutation.mutate();
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <Input
          placeholder="Type a message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="md" isLoading={sendMutation.isPending} disabled={!body.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}