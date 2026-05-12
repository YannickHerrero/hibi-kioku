import { redirect } from "@tanstack/react-router";

const STORAGE_KEY = "kioku-api-key";

export function getApiKey(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw && raw.length > 0 ? raw : null;
  } catch {
    return null;
  }
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key);
}

export function clearApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Use in a route's `beforeLoad`: redirects to /settings if there is no
// stored key, otherwise returns it. Throws are caught by TanStack
// Router and turned into a redirect navigation.
export function requireApiKey(): string {
  const key = getApiKey();
  if (!key) {
    throw redirect({ to: "/settings" });
  }
  return key;
}
