import { QueryClient } from "@tanstack/react-query";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/stores/toast-store";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          if (typeof error === "object" && error !== null && "response" in error) {
            const status = (error as { response ? : { status ? : number } }).response?.status;
            if (status && status >= 400 && status < 500) return false;
          }
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error) => {
          toast.error("Something went wrong", extractErrorMessage(error));
        },
      },
    },
  });
}