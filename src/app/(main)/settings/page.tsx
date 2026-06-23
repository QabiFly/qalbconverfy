"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/query-keys";
import { extractErrorMessage } from "@/lib/api/client";
import {
  notificationService,
  sessionService,
  userService,
} from "@/lib/api/services";
import { useAuth } from "@/providers/auth-provider";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "@/stores/toast-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageSpinner } from "@/components/ui/states";

type SessionItem = {
  id: string;
  device_label?: string | null;
  ip_address?: string | null;
  is_current?: boolean;
};

type PaginatedSessions = {
  results?: SessionItem[];
};

type SessionEnvelope = {
  data?: SessionItem[] | PaginatedSessions;
  results?: SessionItem[];
};

function isSessionItem(value: unknown): value is SessionItem {
  if (!value || typeof value !== "object") return false;
  return typeof (value as Partial<SessionItem>).id === "string";
}

function normalizeSessions(input: unknown): SessionItem[] {
  if (Array.isArray(input)) return input.filter(isSessionItem);

  if (!input || typeof input !== "object") return [];

  const envelope = input as SessionEnvelope;

  if (Array.isArray(envelope.results)) {
    return envelope.results.filter(isSessionItem);
  }

  if (Array.isArray(envelope.data)) {
    return envelope.data.filter(isSessionItem);
  }

  if (
    envelope.data &&
    typeof envelope.data === "object" &&
    Array.isArray(envelope.data.results)
  ) {
    return envelope.data.results.filter(isSessionItem);
  }

  return [];
}

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [bio, setBio] = useState(user?.bio ?? "");

  const { data: preferences } = useQuery({
    queryKey: queryKeys.notificationPreferences,
    queryFn: () => notificationService.getPreferences(),
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: queryKeys.sessions,
    queryFn: () => sessionService.list(),
  });

  const sessionList = useMemo(() => normalizeSessions(sessions), [sessions]);

  const updateProfileMutation = useMutation({
    mutationFn: () => userService.updateMyProfile({ bio }),
    onSuccess: (updated) => {
      setUser(updated);
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error("Could not update profile", extractErrorMessage(error));
    },
  });

  const updatePrefsMutation = useMutation({
    mutationFn: (
      payload: Parameters<typeof notificationService.updatePreferences>[0],
    ) => notificationService.updatePreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.notificationPreferences,
      });
      toast.success("Preferences updated");
    },
    onError: (error) => {
      toast.error("Could not update preferences", extractErrorMessage(error));
    },
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => sessionService.revoke(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("Session revoked");
    },
    onError: (error) => {
      toast.error("Could not revoke session", extractErrorMessage(error));
    },
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => sessionService.revokeAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("All other sessions signed out");
    },
    onError: (error) => {
      toast.error("Could not sign out sessions", extractErrorMessage(error));
    },
  });

  if (!user) return <PageSpinner />;

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-6 text-lg font-semibold text-text-primary">Settings</h1>

      <section className="mb-8 rounded-2xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">Profile</h2>

        <Input
          label="Username"
          value={user.username}
          disabled
          hint="Username changes are managed separately."
        />

        <div className="mt-3">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>

        <Button
          className="mt-3"
          isLoading={updateProfileMutation.isPending}
          onClick={() => updateProfileMutation.mutate()}
        >
          Save changes
        </Button>
      </section>

      {preferences && (
        <section className="mb-8 rounded-2xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">
            Notification preferences
          </h2>

          <div className="flex flex-col gap-3">
            {(
              [
                ["likes_enabled", "Likes"],
                ["comments_enabled", "Comments"],
                ["replies_enabled", "Replies"],
                ["follows_enabled", "Follows"],
                ["mentions_enabled", "Mentions"],
                ["system_enabled", "System"],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between text-sm text-text-primary"
              >
                {label}
                <input
                  type="checkbox"
                  checked={Boolean(preferences[key])}
                  onChange={(event) =>
                    updatePrefsMutation.mutate({ [key]: event.target.checked })
                  }
                  className="h-4 w-4 accent-accent"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            Active sessions
          </h2>

          <Button
            variant="ghost"
            size="sm"
            isLoading={logoutAllMutation.isPending}
            onClick={() => logoutAllMutation.mutate()}
          >
            Sign out all others
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {sessionsLoading ? (
            <p className="text-sm text-text-secondary">Loading sessions...</p>
          ) : sessionList.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No active sessions found.
            </p>
          ) : (
            sessionList.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-lg bg-surface-raised p-3 text-sm"
              >
                <div>
                  <p className="text-text-primary">
                    {session.device_label ?? "Unknown device"}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {session.ip_address ?? "Unknown IP"}
                  </p>
                </div>

                {!session.is_current && (
                  <Button
                    variant="ghost"
                    size="sm"
                    isLoading={revokeSessionMutation.isPending}
                    onClick={() => revokeSessionMutation.mutate(session.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <Button variant="danger" fullWidth onClick={() => logout()}>
        Log out
      </Button>
    </div>
  );
}
