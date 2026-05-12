import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ListCardsSort } from "hibi-client";
import { useState } from "react";
import { z } from "zod";
import { Display } from "../components/ui/Display.tsx";
import { Field } from "../components/ui/Field.tsx";
import { Rule } from "../components/ui/Rule.tsx";
import { SegmentedControl } from "../components/ui/SegmentedControl.tsx";
import { requireApiKey } from "../lib/apiKey.ts";
import { getHibiClient } from "../lib/hibiClient.ts";
import { useSessionTracking } from "../lib/sessions.ts";
import "./library.css";

const SortValues = ["newest", "oldest", "due-soonest"] as const satisfies readonly ListCardsSort[];

const SearchSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(SortValues).default("newest"),
});

type Search = z.infer<typeof SearchSchema>;

export const Route = createFileRoute("/library/")({
  validateSearch: SearchSchema,
  beforeLoad: () => {
    requireApiKey();
  },
  component: LibraryRoute,
});

const SORT_OPTIONS: ReadonlyArray<{ value: ListCardsSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "due-soonest", label: "Due soonest" },
];

function LibraryRoute() {
  useSessionTracking("library");
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [searchInput, setSearchInput] = useState(search.q ?? "");

  const cards = useInfiniteQuery({
    queryKey: ["cards", "list", search],
    queryFn: ({ pageParam }) =>
      getHibiClient().cards.list({
        limit: 50,
        sort: search.sort,
        cursor: pageParam ?? undefined,
        q: search.q,
        tag: search.tag,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });

  const items = cards.data?.pages.flatMap((p) => p.items) ?? [];
  const tags = uniqueTags(items);

  const updateSearch = (next: Partial<Search>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });

  return (
    <main className="library-page">
      <header className="library-header">
        <Display size="lg">Library</Display>
        <span className="meta">{items.length} loaded</span>
      </header>

      <Rule />

      <section className="library-controls">
        <form
          className="library-search"
          onSubmit={(e) => {
            e.preventDefault();
            updateSearch({ q: searchInput.trim() || undefined });
          }}
        >
          <Field
            label="Search"
            name="q"
            type="search"
            placeholder="sentence or focus word"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <SegmentedControl<ListCardsSort>
          ariaLabel="Sort"
          value={search.sort}
          options={SORT_OPTIONS}
          onChange={(sort) => updateSearch({ sort })}
        />
      </section>

      {tags.length > 0 ? (
        <div className="library-tags">
          <span className="meta library-tags-label">tags</span>
          {search.tag ? (
            <button
              type="button"
              className="library-tag is-active"
              onClick={() => updateSearch({ tag: undefined })}
            >
              ✕ {search.tag}
            </button>
          ) : null}
          {tags
            .filter((t) => t !== search.tag)
            .map((t) => (
              <button
                key={t}
                type="button"
                className="library-tag"
                onClick={() => updateSearch({ tag: t })}
              >
                {t}
              </button>
            ))}
        </div>
      ) : null}

      <ul className="library-list">
        {items.map((card) => (
          <li key={card.id} className="library-row">
            <Link to="/library/$cardId" params={{ cardId: card.id }} className="library-row-link">
              <span className="serif library-row-focus">{card.focusWord}</span>
              <span className="library-row-sentence">{card.sentence}</span>
              <span className="meta library-row-meta">
                {new Date(card.createdAt).toLocaleDateString()}
                {card.tags.length > 0 ? ` · ${card.tags.join(", ")}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {cards.hasNextPage ? (
        <div className="library-loadmore">
          <button
            type="button"
            className="library-loadmore-btn"
            onClick={() => cards.fetchNextPage()}
            disabled={cards.isFetchingNextPage}
          >
            {cards.isFetchingNextPage ? "Loading…" : "Load more"}
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="library-end meta">end</div>
      ) : cards.isLoading ? (
        <div className="meta library-end">loading…</div>
      ) : (
        <div className="library-empty">
          <p className="meta">no cards match these filters</p>
        </div>
      )}
    </main>
  );
}

function uniqueTags(items: ReadonlyArray<{ tags: string[] }>): string[] {
  const seen = new Set<string>();
  for (const item of items) {
    for (const tag of item.tags) seen.add(tag);
  }
  return Array.from(seen).sort();
}
