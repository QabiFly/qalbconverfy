"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { APP_ROUTES } from "@/constants/app-routes";

export function useRequireAuth() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  
  useEffect(() => {
    if (!isHydrating && !user) {
      router.replace(APP_ROUTES.login);
    }
  }, [isHydrating, user, router]);
  
  return { user, isHydrating, isReady: !isHydrating && Boolean(user) };
}

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  
  useEffect(() => {
    if (!isHydrating && user) {
      router.replace(APP_ROUTES.home);
    }
  }, [isHydrating, user, router]);
  
  return { isHydrating };
}