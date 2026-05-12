import type { FuriganaPair, ReviewRating } from "hibi-client";
import { FuriganaText } from "./FuriganaText.tsx";
import { ReviewButtonGroup } from "./ReviewButton.tsx";
import "./SentenceCard.css";

interface SentenceCardProps {
  furigana: FuriganaPair[];
  english: string;
  focusWord: string;
  glosses: string[];
  source?: string;
  audioUrl?: string | null;
  imageUrl?: string | null;
  revealed?: boolean;
  onReveal?: () => void;
  onRate?: (r: ReviewRating) => void;
  rating?: boolean;
}

export function SentenceCard({
  furigana,
  english,
  focusWord,
  glosses,
  source,
  audioUrl,
  imageUrl,
  revealed = true,
  onReveal,
  onRate,
  rating,
}: SentenceCardProps) {
  return (
    <article className="sc">
      {source ? <div className="meta sc-source">{source}</div> : null}

      <FuriganaText pairs={furigana} size={32} />

      {audioUrl ? (
        <div className="sc-audio">
          <audio controls preload="none" src={audioUrl}>
            <track kind="captions" />
          </audio>
        </div>
      ) : null}

      <hr className="rule-soft sc-divider" />

      <div className="meta sc-eyebrow">Focus</div>
      <div className="serif sc-focus">{focusWord}</div>

      {revealed ? (
        <>
          <div className="meta sc-eyebrow">Meaning</div>
          <div className="serif sc-meaning">{english}</div>

          {glosses.length > 0 ? (
            <>
              <div className="meta sc-eyebrow">Glosses</div>
              <ul className="sans sc-glosses">
                {glosses.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </>
          ) : null}

          {imageUrl ? (
            <div className="sc-image">
              <img src={imageUrl} alt="" />
            </div>
          ) : null}

          {onRate ? (
            <div className="sc-actions">
              <ReviewButtonGroup onRate={onRate} disabled={rating} />
            </div>
          ) : null}
        </>
      ) : (
        <div className="sc-reveal-row">
          <button type="button" className="sc-reveal" onClick={onReveal}>
            Reveal answer · space
          </button>
        </div>
      )}
    </article>
  );
}
