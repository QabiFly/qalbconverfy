"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, notificationService, sessionService } from "@/lib/api/services";
import { queryKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import { useAuth } from "@/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/states";
import { toast } from "@/stores/toast-store";
import { extractErrorMessage } from "@/lib/api/client";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [bio, setBio] = useState(user?.bio ?? "");
  
  const { data: preferences } = useQuery({
    queryKey: queryKeys.notificationPreferences,
    queryFn: () => notificationService.getPreferences(),
  });
  
  const { data: sessions } = useQuery({
    queryKey: queryKeys.sessions,
    queryFn: () => sessionService.list(),
  });
  
  const updateProfileMutation = useMutation({
    mutationFn: () => userService.updateMyProfile({ bio }),
    onSuccess: (updated) => {
      setUser(updated);
      toast.success("Profile updated");
    },
    onError: (error) => toast.error("Could not update profile", extractErrorMessage(error)),
  });
  
  const updatePrefsMutation = useMutation({
    mutationFn: (payload: Parameters < typeof notificationService.updatePreferences > [0]) =>
      notificationService.updatePreferences(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationPreferences });
      toast.success("Preferences updated");
    },
  });
  
  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => sessionService.revoke(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
      toast.success("Session revoked");
    },
  });
  
  const logoutAllMutation = useMutation({
    mutationFn: () => sessionService.revokeAll(),
    onSuccess: () => {
      toast.success("All other sessions signed out");
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions });
    },
  });
  
  if (!user) return <PageSpinner />;
  
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <h1 className="mb-6 text-lg font-semibold text-text-primary">Settings</h1>

      <section className="mb-8 rounded-2xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">Profile</h2>
        <Input label="Username" value={user.username} disabled hint="Username changes are managed separately." />
        <div className="mt-3">
          <label className="mb-1.5 block text-sm font-medium text-text-secondary">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <Button className="mt-3" isLoading={updateProfileMutation.isPending} onClick={() => updateProfileMutation.mutate()}>
          Save changes
        </Button>
      </section>

      {preferences && (
        <section className="mb-8 rounded-2xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">Notification preferences</h2>
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
              <label key={key} className="flex items-center justify-between text-sm text-text-primary">
                {label}
                <input
                  type="checkbox"
                  checked={Boolean(preferences[key])}
                  onChange={(e) => updatePrefsMutation.mutate({ [key]: e.target.checked })}
                  className="h-4 w-4 accent-accent"
                />
              </label>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 rounded-2xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Active sessions</h2>
          <Button variant="ghost" size="sm" onClick={() => logoutAllMutation.mutate()}>
            Sign out all others
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {sessions?.map((session) => (
            <div key={session.id} className="flex items-center justify-between rounded-lg bg-surface-raised p-3 text-sm">
              <div>
                <p className="text-text-primary">{session.device_label ?? "Unknown device"}</p>
                <p className="text-xs text-text-tertiary">{session.ip_address}</p>
              </div>
              {!session.is_current && (
                <Button variant="ghost" size="sm" onClick={() => revokeSessionMutation.mutate(session.id)}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <Button variant="danger" fullWidth onClick={() => logout()}>
        Log out
      </Button>
    </div>
  );
}