import type { FuriganaPair } from "hibi-client";

interface FuriganaTextProps {
  pairs: FuriganaPair[];
  size?: number;
  className?: string;
}

export function FuriganaText({ pairs, size = 28, className }: FuriganaTextProps) {
  return (
    <span
      className={className}
      style={{ fontFamily: "'Newsreader', serif", fontSize: size, lineHeight: 1.6 }}
    >
      {pairs.map((p, i) => {
        // Furigana pairs are immutable per render — index is a stable key here.
        const key = `${i}-${p.base}`;
        if (!p.reading) return <span key={key}>{p.base}</span>;
        return (
          <ruby key={key}>
            {p.base}
            <rt
              style={{
                fontSize: size * 0.45,
                fontFamily: "'Geist', sans-serif",
                letterSpacing: "0.02em",
                color: "var(--ink-soft)",
              }}
            >
              {p.reading}
            </rt>
          </ruby>
        );
      })}
    </span>
  );
}
