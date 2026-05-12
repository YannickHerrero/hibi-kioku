import { useEffect, useRef } from "react";
import { getHibiClient } from "./hibiClient.ts";

const SOURCE = "hibi-kioku";

// Records a single session for the lifetime of the calling component
// (mount → unmount). Sessions shorter than `minMs` are dropped to avoid
// noise from accidental navigation. Failures are swallowed — session
// tracking is non-essential and shouldn't break the UI.
export function useSessionTracking(kind: "review" | "library", minMs = 5_000) {
  const startRef = useRef<Date | null>(null);

  useEffect(() => {
    startRef.current = new Date();
    return () => {
      const startedAt = startRef.current;
      if (!startedAt) return;
      const endedAt = new Date();
      const durationMs = endedAt.getTime() - startedAt.getTime();
      if (durationMs < minMs) return;

      // Fire-and-forget; cleanup runs synchronously, so we don't await.
      getHibiClient()
        .sessions.create({
          kind,
          source: SOURCE,
          startedAt: startedAt.toISOString(),
          endedAt: endedAt.toISOString(),
          durationMs,
        })
        .catch(() => {
          // Intentionally swallowed — telemetry, not load-bearing.
        });
    };
  }, [kind, minMs]);
}
