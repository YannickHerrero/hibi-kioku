import type { ReviewRating } from "hibi-client";
import "./ReviewButton.css";

const LABELS: Record<ReviewRating, string> = {
  1: "Again",
  2: "Hard",
  3: "Good",
  4: "Easy",
};

const SHORTCUTS: Record<ReviewRating, string> = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
};

interface ReviewButtonProps {
  rating: ReviewRating;
  onClick: (rating: ReviewRating) => void;
  disabled?: boolean;
}

export function ReviewButton({ rating, onClick, disabled }: ReviewButtonProps) {
  const cls = rating === 3 ? "rb is-good" : rating === 1 ? "rb is-again" : "rb is-other";
  return (
    <button
      type="button"
      className={cls}
      onClick={() => onClick(rating)}
      disabled={disabled}
      aria-keyshortcuts={SHORTCUTS[rating]}
    >
      <span className="rb-label">{LABELS[rating]}</span>
      <span className="rb-shortcut">{SHORTCUTS[rating]}</span>
    </button>
  );
}

export function ReviewButtonGroup({
  onRate,
  disabled,
}: {
  onRate: (r: ReviewRating) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset className="rb-group" aria-label="Rate this card">
      {([1, 2, 3, 4] as const).map((r) => (
        <ReviewButton key={r} rating={r} onClick={onRate} disabled={disabled} />
      ))}
    </fieldset>
  );
}
