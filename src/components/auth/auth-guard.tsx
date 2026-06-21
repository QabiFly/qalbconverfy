"use client";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { PageSpinner } from "@/components/ui/states";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isReady, isHydrating } = useRequireAuth();
  
  if (isHydrating) {
    return <PageSpinner label="Loading your session..." />;
  }
  
  if (!isReady) {
    return <PageSpinner label="Redirecting to login..." />;
  }
  
  return <>{children}</>;
}