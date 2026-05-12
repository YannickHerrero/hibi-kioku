import { useEffect, useState } from "react";

export const THEMES = ["paper", "stone", "sage", "clay", "ink"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "kioku-theme";
const DEFAULT_THEME: Theme = "paper";

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

function readStoredTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isTheme(raw) ? raw : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

// Call once at app boot, synchronously, BEFORE React renders — this
// avoids a flash of the default theme on first paint.
export function hydrateTheme(): void {
  applyTheme(readStoredTheme());
}

export function useTheme(): [Theme, (next: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme());

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage may be unavailable (private mode); theme still applies in-memory
    }
  }, [theme]);

  return [theme, setThemeState];
}
