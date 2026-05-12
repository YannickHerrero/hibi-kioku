import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Heatmap } from "../components/design-system/Heatmap.tsx";
import { Display } from "../components/ui/Display.tsx";
import { Rule } from "../components/ui/Rule.tsx";
import { SegmentedControl } from "../components/ui/SegmentedControl.tsx";
import { requireApiKey } from "../lib/apiKey.ts";
import { getHibiClient } from "../lib/hibiClient.ts";
import "./stats.css";

const CURRENT_YEAR = new Date().getUTCFullYear();

const SearchSchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(2020)
    .max(CURRENT_YEAR + 1)
    .default(CURRENT_YEAR),
});

export const Route = createFileRoute("/stats")({
  validateSearch: SearchSchema,
  beforeLoad: () => {
    requireApiKey();
  },
  component: StatsRoute,
});

const YEAR_OPTIONS = Array.from({ length: 4 }, (_, i) => {
  const y = CURRENT_YEAR - i;
  return { value: String(y), label: String(y) };
});

function StatsRoute() {
  const { year } = Route.useSearch();
  const navigate = Route.useNavigate();

  const heatmap = useQuery({
    queryKey: ["stats", "heatmap", year],
    queryFn: () => getHibiClient().stats.heatmap({ year }),
  });

  const retention = useQuery({
    queryKey: ["stats", "retention"],
    queryFn: () => getHibiClient().stats.retention(),
  });

  const daily = useQuery({
    queryKey: ["stats", "daily", year],
    queryFn: () =>
      getHibiClient().stats.daily({
        from: `${year}-01-01`,
        to: `${year}-12-31`,
      }),
  });

  const totalReviews = heatmap.data?.days.reduce((acc, d) => acc + d.count, 0) ?? 0;
  const activeDays = heatmap.data?.days.filter((d) => d.count > 0).length ?? 0;
  const latestRetention = retention.data?.points.at(-1);

  return (
    <main className="stats-page">
      <header className="stats-header">
        <Display size="lg">Stats</Display>
        <SegmentedControl
          ariaLabel="Year"
          value={String(year)}
          options={YEAR_OPTIONS}
          onChange={(next) => navigate({ search: { year: Number(next) } })}
        />
      </header>

      <Rule />

      <section className="stats-section">
        <span className="meta stats-eyebrow">Year heatmap</span>
        {heatmap.isLoading ? (
          <p className="meta">loading…</p>
        ) : heatmap.isError ? (
          <p className="meta">error: {String(heatmap.error)}</p>
        ) : (
          <div className="stats-heatmap-wrap">
            <Heatmap year={year} days={heatmap.data?.days ?? []} />
          </div>
        )}
        <div className="stats-summary">
          <Stat label="Reviews" value={totalReviews.toLocaleString()} />
          <Stat label="Active days" value={String(activeDays)} />
        </div>
      </section>

      <Rule variant="soft" />

      <section className="stats-section">
        <span className="meta stats-eyebrow">Retention (last sample)</span>
        {retention.isLoading ? (
          <p className="meta">loading…</p>
        ) : retention.isError ? (
          <p className="meta">error: {String(retention.error)}</p>
        ) : latestRetention ? (
          <div className="stats-summary">
            <Stat label="Retention" value={`${Math.round(latestRetention.retention * 100)}%`} />
            <Stat label="Sample size" value={`${latestRetention.sampleSize} reviews`} />
            <Stat label="Interval" value={`${latestRetention.intervalDays}d`} />
          </div>
        ) : (
          <p className="meta">no retention data yet</p>
        )}
      </section>

      <Rule variant="soft" />

      <section className="stats-section">
        <span className="meta stats-eyebrow">Daily counts ({year})</span>
        {daily.isLoading ? (
          <p className="meta">loading…</p>
        ) : daily.isError ? (
          <p className="meta">error: {String(daily.error)}</p>
        ) : (
          <ul className="stats-daily">
            {(daily.data?.days ?? [])
              .filter((d) => d.reviews > 0)
              .slice(-30)
              .reverse()
              .map((d) => (
                <li key={d.date} className="stats-daily-row">
                  <span className="meta">{d.date}</span>
                  <span className="mono stats-daily-count">{d.reviews}</span>
                </li>
              ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stats-stat">
      <span className="meta stats-stat-label">{label}</span>
      <span className="display stats-stat-value">{value}</span>
    </div>
  );
}
