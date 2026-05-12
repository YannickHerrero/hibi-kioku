import type { HeatmapDay } from "hibi-client";

interface HeatmapProps {
  year: number;
  days: HeatmapDay[];
  cellSize?: number;
  gap?: number;
}

function isLeapYear(y: number): boolean {
  return y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
}

export function Heatmap({ year, days, cellSize = 11, gap = 2 }: HeatmapProps) {
  const byDate = new Map(days.map((d) => [d.date, d.count]));
  const max = Math.max(1, ...days.map((d) => d.count));

  const yearStart = new Date(Date.UTC(year, 0, 1));
  const startDayOfWeek = yearStart.getUTCDay();
  const totalDays = isLeapYear(year) ? 366 : 365;

  const cells = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(Date.UTC(year, 0, 1 + i));
    const date = d.toISOString().slice(0, 10);
    const offset = i + startDayOfWeek;
    return {
      date,
      count: byDate.get(date) ?? 0,
      col: Math.floor(offset / 7),
      row: offset % 7,
    };
  });

  const columns = Math.ceil((totalDays + startDayOfWeek) / 7);
  const step = cellSize + gap;
  const width = columns * step - gap;
  const height = 7 * step - gap;

  return (
    <svg width={width} height={height} role="img" aria-label={`${year} review heatmap`}>
      {cells.map((c) => {
        const intensity = c.count / max;
        const fill =
          c.count === 0
            ? "var(--rule-soft)"
            : `color-mix(in srgb, var(--accent) ${Math.round(20 + intensity * 80)}%, transparent)`;
        return (
          <rect
            key={c.date}
            x={c.col * step}
            y={c.row * step}
            width={cellSize}
            height={cellSize}
            fill={fill}
          >
            <title>
              {c.date}: {c.count} review{c.count === 1 ? "" : "s"}
            </title>
          </rect>
        );
      })}
    </svg>
  );
}
