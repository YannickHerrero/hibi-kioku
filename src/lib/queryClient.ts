import { QueryClient } from "@tanstack/react-query";
import type { HibiClientError } from "hibi-client";

function isHibiClientError(err: unknown): err is HibiClientError {
  return (
    err instanceof Error && typeof (err as HibiClientError).status === "number" && "body" in err
  );
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (isHibiClientError(error)) {
          // Auth errors will not resolve by retrying — surface immediately
          // so the route loader can redirect to /settings.
          if (error.status === 401 || error.status === 403) return false;
          // 4xx (except auth) are usually request bugs, not transient
          if (error.status >= 400 && error.status < 500) return false;
        }
        return failureCount < 2;
      },
    },
  },
});
