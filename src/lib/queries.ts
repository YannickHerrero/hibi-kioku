import { queryOptions } from "@tanstack/react-query";
import { getHibiClient } from "./hibiClient.ts";

export const dueCardsQueryOptions = (limit = 50) =>
  queryOptions({
    queryKey: ["reviews", "due", { limit }] as const,
    queryFn: () => getHibiClient().reviews.due({ limit }),
    staleTime: 0,
  });

export const cardQueryOptions = (cardId: string) =>
  queryOptions({
    queryKey: ["cards", "byId", cardId] as const,
    queryFn: () => getHibiClient().cards.get(cardId),
  });
