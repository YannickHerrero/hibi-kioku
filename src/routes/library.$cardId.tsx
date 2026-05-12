import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FuriganaText } from "../components/design-system/FuriganaText.tsx";
import { KanjiTable } from "../components/design-system/KanjiTable.tsx";
import { Display } from "../components/ui/Display.tsx";
import { Rule } from "../components/ui/Rule.tsx";
import { requireApiKey } from "../lib/apiKey.ts";
import { cardQueryOptions } from "../lib/queries.ts";
import "./card-detail.css";

export const Route = createFileRoute("/library/$cardId")({
  beforeLoad: () => {
    requireApiKey();
  },
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(cardQueryOptions(params.cardId)),
  component: CardDetailRoute,
});

function CardDetailRoute() {
  const { cardId } = Route.useParams();
  const card = useQuery(cardQueryOptions(cardId));

  if (card.isLoading) {
    return (
      <main className="cd-page">
        <p className="meta">loading…</p>
      </main>
    );
  }

  if (card.isError || !card.data) {
    return (
      <main className="cd-page">
        <p className="meta">card not found</p>
        <Link to="/library" className="meta cd-back">
          ← back to library
        </Link>
      </main>
    );
  }

  const c = card.data;
  return (
    <main className="cd-page">
      <Link to="/library" className="meta cd-back">
        ← library
      </Link>

      <header className="cd-header">
        <Display size="md">{c.focusWord}</Display>
        {c.source ? <span className="meta">{c.source}</span> : null}
      </header>

      <Rule />

      <section className="cd-section">
        <FuriganaText pairs={c.furigana} size={28} />
      </section>

      {c.audioUrl ? (
        <section className="cd-section">
          <span className="meta cd-eyebrow">Audio</span>
          <audio controls preload="none" src={c.audioUrl}>
            <track kind="captions" />
          </audio>
        </section>
      ) : null}

      <section className="cd-section">
        <span className="meta cd-eyebrow">Meaning</span>
        <p className="serif cd-meaning">{c.english}</p>
      </section>

      {c.glosses.length > 0 ? (
        <section className="cd-section">
          <span className="meta cd-eyebrow">Glosses</span>
          <ul className="cd-glosses">
            {c.glosses.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {c.grammarNote ? (
        <section className="cd-section">
          <span className="meta cd-eyebrow">Grammar note</span>
          <p className="serif italic cd-grammar">{c.grammarNote}</p>
        </section>
      ) : null}

      {c.kanjiList.length > 0 ? (
        <section className="cd-section">
          <span className="meta cd-eyebrow">Kanji</span>
          <KanjiTable entries={c.kanjiList} />
        </section>
      ) : null}

      {c.imageUrl ? (
        <section className="cd-section">
          <span className="meta cd-eyebrow">Image</span>
          <div className="cd-image">
            <img src={c.imageUrl} alt="" />
          </div>
        </section>
      ) : null}

      {c.tags.length > 0 ? (
        <section className="cd-section">
          <span className="meta cd-eyebrow">Tags</span>
          <div className="cd-tags">
            {c.tags.map((t) => (
              <Link key={t} to="/library" search={{ tag: t }} className="cd-tag">
                {t}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
