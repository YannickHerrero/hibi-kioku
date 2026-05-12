import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./lib/queryClient.ts";
import { routeTree } from "./routeTree.gen.ts";

export { queryClient };

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
