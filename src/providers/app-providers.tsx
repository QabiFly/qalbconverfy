"use client";

import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToastViewport } from "@/components/ui/toast-viewport";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <ToastViewport />
      </AuthProvider>
    </QueryProvider>
  );
}