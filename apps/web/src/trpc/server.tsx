import "server-only";

import type { AppRouter } from "@api/trpc/router";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { API_BASE_URL } from "@web/config";
import { createQueryClient } from "@web/trpc/query-client";
import { cache, type ReactNode } from "react";
import superjson from "superjson";

export const getQueryClient = cache(createQueryClient);

export const trpc = createTRPCOptionsProxy<AppRouter>({
  queryClient: getQueryClient,
  client: createTRPCClient({
    links: [
      httpBatchLink({
        url: `${API_BASE_URL}/trpc`,
        transformer: superjson,
        headers() {
          return {
            Authorization: `Bearer ${process.env.SG_CARS_TRENDS_API_TOKEN}`,
          };
        },
      }),
    ],
  }),
});

export const HydrateClient = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};
