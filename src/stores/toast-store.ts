import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description ? : string;
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
  show: (toast: Omit < ToastItem, "id" | "duration" > & { duration ? : number }) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create < ToastState > ((set) => ({
  toasts: [],
  
  show: (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const duration = toast.duration ?? 4000;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id, duration }] }));
    
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (title: string, description ? : string) =>
    useToastStore.getState().show({ variant: "success", title, description }),
  error: (title: string, description ? : string) =>
    useToastStore.getState().show({ variant: "error", title, description }),
  info: (title: string, description ? : string) =>
    useToastStore.getState().show({ variant: "info", title, description }),
  warning: (title: string, description ? : string) =>
    useToastStore.getState().show({ variant: "warning", title, description }),
};