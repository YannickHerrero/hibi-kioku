import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Card, ReviewRating } from "hibi-client";
import { useCallback, useState } from "react";
import { SentenceCard } from "../components/design-system/SentenceCard.tsx";
import { requireApiKey } from "../lib/apiKey.ts";
import { getHibiClient } from "../lib/hibiClient.ts";
import { useKeyboardShortcut } from "../lib/keyboard.ts";
import { dueCardsQueryOptions } from "../lib/queries.ts";
import "./review.css";

export const Route = createFileRoute("/review")({
  beforeLoad: () => {
    requireApiKey();
  },
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(dueCardsQueryOptions(50)),
  component: ReviewRoute,
});

function ReviewRoute() {
  const queryClient = useQueryClient();
  const due = useQuery(dueCardsQueryOptions(50));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const submit = useMutation({
    mutationFn: (input: { cardId: string; rating: ReviewRating }) =>
      getHibiClient().reviews.submit(input),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["stats"] }),
  });

  if (due.isLoading) {
    return (
      <main className="review-page">
        <p className="meta">loading…</p>
      </main>
    );
  }

  if (due.isError) {
    return (
      <main className="review-page">
        <p className="meta">error loading cards: {String(due.error)}</p>
      </main>
    );
  }

  const items = due.data?.items ?? [];
  const item = items[index];

  if (!item) {
    return (
      <main className="review-page">
        <div className="review-done">
          <p className="display" style={{ fontSize: "var(--t-display-md)" }}>
            お疲れさま
          </p>
          <p className="meta">all caught up — no cards due</p>
        </div>
      </main>
    );
  }

  const handleRate = (rating: ReviewRating) => {
    // Fire-and-advance: optimistically move to next card before the API
    // settles. Errors surface via submit.isError on the toolbar.
    submit.mutate({ cardId: item.card.id, rating });
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  return (
    <ReviewSession
      total={items.length}
      index={index}
      revealed={revealed}
      onReveal={() => setRevealed(true)}
      onRate={handleRate}
      submitting={false}
      card={item.card}
      lastError={submit.isError ? String(submit.error) : null}
    />
  );
}

interface SessionProps {
  total: number;
  index: number;
  revealed: boolean;
  onReveal: () => void;
  onRate: (r: ReviewRating) => void;
  submitting: boolean;
  card: Card;
  lastError: string | null;
}

function ReviewSession({
  total,
  index,
  revealed,
  onReveal,
  onRate,
  submitting,
  card,
  lastError,
}: SessionProps) {
  const onShortcut = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Spacebar") {
        if (!revealed) {
          event.preventDefault();
          onReveal();
        }
        return;
      }
      if (!revealed) return;
      const r = Number(event.key);
      if (r >= 1 && r <= 4) {
        event.preventDefault();
        onRate(r as ReviewRating);
      }
    },
    [revealed, onReveal, onRate],
  );
  useKeyboardShortcut([" ", "Spacebar", "1", "2", "3", "4"], onShortcut);

  return (
    <main className="review-page">
      <div className="review-meta">
        <span className="meta">
          {index + 1} / {total}
        </span>
        {lastError ? (
          <span className="meta review-error">last submit failed: {lastError}</span>
        ) : null}
      </div>
      <SentenceCard
        furigana={card.furigana}
        english={card.english}
        focusWord={card.focusWord}
        glosses={card.glosses}
        source={card.source}
        audioUrl={card.audioUrl}
        imageUrl={card.imageUrl}
        revealed={revealed}
        onReveal={onReveal}
        onRate={onRate}
        rating={submitting}
      />
    </main>
  );
}
