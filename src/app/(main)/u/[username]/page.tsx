"use client";

import { useParams } from "next/navigation";
import { ProfileView } from "@/components/feed/profile-view";
import { useAuthStore } from "@/stores/auth-store";

export default function PublicProfilePage() {
  const params = useParams < { username: string } > ();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = currentUser?.username === params.username;
  
  return <ProfileView username={params.username} isOwnProfile={isOwnProfile} />;
}