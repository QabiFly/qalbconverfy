"use client";

import { useToastStore, ToastVariant } from "@/stores/toast-store";
import { cn } from "@/lib/cn";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

const variantConfig: Record < ToastVariant, { icon: React.ComponentType < { className ? : string } > ;accent: string } > = {
  success: { icon: CheckCircle2, accent: "text-success" },
  error: { icon: XCircle, accent: "text-danger" },
  info: { icon: Info, accent: "text-accent" },
  warning: { icon: AlertTriangle, accent: "text-warning" },
};

export function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  
  if (toasts.length === 0) return null;
  
  return (
    <div
      className="fixed bottom-20 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:bottom-6"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const { icon: Icon, accent } = variantConfig[t.variant];
        return (
          <div key={t.id} className="animate-slide-up flex items-start gap-3 rounded-xl border border-border bg-surface-raised p-3.5 shadow-card" role="status">
            <Icon className={cn("mt-0.5 h-5 w-5 flex-shrink-0", accent)} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-text-secondary">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="flex-shrink-0 text-text-tertiary hover:text-text-primary" aria-label="Dismiss notification">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}