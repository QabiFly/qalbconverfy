"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { APP_ROUTES } from "@/constants/app-routes";
import { messagingService } from "@/lib/api/services";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/stores/toast-store";
import { extractErrorMessage } from "@/lib/api/client";
import type { UserMini } from "@/types";

export function UserListRow({ user }: { user: UserMini }) {
  const router = useRouter();

  const messageMutation = useMutation({
    mutationFn: () => messagingService.startDirectConversation(user.username),
    onSuccess: (conversation) => {
      router.push(APP_ROUTES.conversation(conversation.id));
    },
    onError: (error) => {
      toast.error("Could not start conversation", extractErrorMessage(error));
    },
  });

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
      <Link href={APP_ROUTES.userProfile(user.username)}>
        <Avatar
          src={user.avatar_url}
          username={user.username}
          size="md"
          verificationLevel={user.verification_level}
        />
      </Link>

      <Link
        href={APP_ROUTES.userProfile(user.username)}
        className="min-w-0 flex-1"
      >
        <p className="truncate text-sm font-semibold text-text-primary">
          @{user.username}
        </p>
        {user.profile_slug && (
          <p className="truncate text-xs text-text-tertiary">
            {user.profile_slug}
          </p>
        )}
      </Link>

      <Button
        variant="secondary"
        size="sm"
        isLoading={messageMutation.isPending}
        onClick={() => messageMutation.mutate()}
      >
        <MessageCircle className="h-4 w-4" />
        Message
      </Button>
    </div>
  );
}
