import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Display } from "../components/ui/Display.tsx";
import { Rule } from "../components/ui/Rule.tsx";
import { getApiKey } from "../lib/apiKey.ts";
import { dueCardsQueryOptions } from "../lib/queries.ts";
import "./index.css";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const hasKey = getApiKey() !== null;

  const due = useQuery({
    ...dueCardsQueryOptions(50),
    enabled: hasKey,
  });

  const count = due.data?.items.length ?? 0;

  return (
    <main className="landing-page">
      <header className="landing-header">
        <Display size="xl">Hibi Kioku</Display>
        <p className="serif italic landing-tagline">記憶 · the studying half of Hibi</p>
      </header>

      <Rule />

      {!hasKey ? (
        <section className="landing-cta">
          <p className="serif landing-prompt">
            No API key yet. Generate one in the Hibi portal, then drop it in here.
          </p>
          <Link to="/settings" className="landing-action">
            Open settings →
          </Link>
        </section>
      ) : due.isLoading ? (
        <p className="meta">checking due cards…</p>
      ) : due.isError ? (
        <section className="landing-cta">
          <p className="meta">Couldn't reach the API. Check the key in settings.</p>
          <Link to="/settings" className="landing-action">
            Open settings →
          </Link>
        </section>
      ) : count > 0 ? (
        <section className="landing-cta">
          <p className="display landing-count">
            {count}
            <span className="meta landing-count-label">card{count === 1 ? "" : "s"} due</span>
          </p>
          <Link to="/review" className="landing-action landing-action-primary">
            Start review →
          </Link>
        </section>
      ) : (
        <section className="landing-cta">
          <p className="serif landing-prompt">All caught up. Nothing due right now.</p>
          <Link to="/library" className="landing-action">
            Browse library →
          </Link>
        </section>
      )}
    </main>
  );
}
