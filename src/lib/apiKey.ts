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
