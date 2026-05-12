import type { KanjiEntry } from "hibi-client";
import "./KanjiTable.css";

interface KanjiTableProps {
  entries: KanjiEntry[];
}

export function KanjiTable({ entries }: KanjiTableProps) {
  if (entries.length === 0) return null;
  return (
    <table className="kt">
      <thead>
        <tr>
          <th className="kt-h-glyph">Kanji</th>
          <th>Meaning</th>
          <th className="kt-h-level">WK Lvl</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((e) => (
          <tr key={e.kanji}>
            <td className="serif kt-glyph">{e.kanji}</td>
            <td className="sans kt-meaning">{e.meaning}</td>
            <td className="mono kt-level">{e.wanikaniLevel ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
