import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { ReviewRating } from "hibi-client";
import { useState } from "react";
import { SentenceCard } from "../components/design-system/SentenceCard.tsx";
import { requireApiKey } from "../lib/apiKey.ts";
import { getHibiClient } from "../lib/hibiClient.ts";
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
    onSuccess: () => {
      setRevealed(false);
      setIndex((i) => i + 1);
    },
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
    if (submit.isPending) return;
    submit.mutate({ cardId: item.card.id, rating });
  };

  return (
    <main className="review-page">
      <div className="review-meta">
        <span className="meta">
          {index + 1} / {items.length}
        </span>
      </div>
      <SentenceCard
        furigana={item.card.furigana}
        english={item.card.english}
        focusWord={item.card.focusWord}
        glosses={item.card.glosses}
        source={item.card.source}
        audioUrl={item.card.audioUrl}
        imageUrl={item.card.imageUrl}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        onRate={handleRate}
        rating={submit.isPending}
      />
    </main>
  );
}
