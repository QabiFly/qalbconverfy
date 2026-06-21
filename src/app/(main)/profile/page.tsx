"use client";

import { useAuthStore } from "@/stores/auth-store";
import { ProfileView } from "@/components/feed/profile-view";
import { PageSpinner } from "@/components/ui/states";

export default function MyProfilePage() {
  const user = useAuthStore((s) => s.user);
  
  if (!user) return <PageSpinner />;
  
  return <ProfileView username={user.username} isOwnProfile />;
}