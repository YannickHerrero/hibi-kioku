import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createHibiClient, type HibiClientError } from "hibi-client";
import { useState } from "react";
import { ThemeSwitcher } from "../components/ThemeSwitcher.tsx";
import { Button } from "../components/ui/Button.tsx";
import { Display } from "../components/ui/Display.tsx";
import { Field } from "../components/ui/Field.tsx";
import { Label } from "../components/ui/Label.tsx";
import { Rule } from "../components/ui/Rule.tsx";
import { clearApiKey, getApiKey, setApiKey } from "../lib/apiKey.ts";
import { resetHibiClient } from "../lib/hibiClient.ts";
import "./settings.css";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

const BASE_URL =
  (import.meta.env.VITE_HIBI_BASE_URL as string | undefined) ?? "https://hibi-api.vercel.app";

async function validateKey(key: string): Promise<void> {
  const probe = createHibiClient({ apiKey: key, baseUrl: BASE_URL });
  await probe.cards.list({ limit: 1, sort: "newest" });
}

function Settings() {
  const queryClient = useQueryClient();
  const [pending, setPending] = useState("");
  const currentKey = getApiKey();

  const validation = useMutation({
    mutationFn: async (key: string) => {
      await validateKey(key);
      setApiKey(key);
      resetHibiClient();
      await queryClient.invalidateQueries();
      return key;
    },
    onSuccess: () => setPending(""),
  });

  const handleClear = () => {
    clearApiKey();
    resetHibiClient();
    queryClient.clear();
    validation.reset();
  };

  const status = validation.isPending
    ? "validating…"
    : validation.isSuccess
      ? "connected"
      : validation.isError
        ? formatError(validation.error)
        : currentKey
          ? "connected"
          : "no key";

  return (
    <main className="settings-page">
      <header className="settings-header">
        <Display size="lg">Settings</Display>
      </header>

      <Rule />

      <section className="settings-section">
        <Label>Theme</Label>
        <ThemeSwitcher />
      </section>

      <Rule variant="soft" />

      <section className="settings-section">
        <Label>API key</Label>
        <p className="settings-hint">
          Generate one in the Hibi portal → Account. The key is stored in this browser only.
        </p>
        <div className="settings-keystatus">
          <span className="settings-status-label">status</span>
          <span
            className={[
              "settings-status",
              validation.isError ? "is-error" : currentKey || validation.isSuccess ? "is-ok" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {status}
          </span>
        </div>

        <form
          className="settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = pending.trim();
            if (!trimmed) return;
            validation.mutate(trimmed);
          }}
        >
          <Field
            label="paste new key"
            name="apiKey"
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="hibi_…"
            value={pending}
            onChange={(e) => setPending(e.target.value)}
          />
          <div className="settings-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={validation.isPending || !pending.trim()}
            >
              {validation.isPending ? "Validating…" : "Save"}
            </Button>
            {currentKey ? (
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear key
              </Button>
            ) : null}
          </div>
        </form>
      </section>
    </main>
  );
}

function formatError(err: unknown): string {
  if (err instanceof Error) {
    const status = (err as HibiClientError).status;
    if (status === 401 || status === 403) return "invalid key";
    if (typeof status === "number") return `error ${status}`;
    return err.message;
  }
  return "error";
}
