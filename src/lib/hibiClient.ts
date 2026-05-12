import { createHibiClient, type HibiClient } from "hibi-client";
import { getApiKey } from "./apiKey.ts";

const DEFAULT_BASE_URL = "https://hibi-api.vercel.app";
const BASE_URL = (import.meta.env.VITE_HIBI_BASE_URL as string | undefined) ?? DEFAULT_BASE_URL;

let cached: { key: string; client: HibiClient } | null = null;

// Returns a HibiClient bound to the currently stored API key.
// Memoized: same key = same client instance. Throws if no key is set —
// guard upstream with an ApiKeyGate route loader.
export function getHibiClient(): HibiClient {
  const key = getApiKey();
  if (!key) throw new Error("hibi-kioku: missing API key");
  if (cached && cached.key === key) return cached.client;
  const client = createHibiClient({ apiKey: key, baseUrl: BASE_URL });
  cached = { key, client };
  return client;
}

// Reset the memoized client (e.g. after the user changes or clears the key).
export function resetHibiClient(): void {
  cached = null;
}
