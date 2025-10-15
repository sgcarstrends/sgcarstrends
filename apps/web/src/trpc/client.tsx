"use client";

import type { AppRouter } from "@api/trpc/router";
import {
  isServer,
  type QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { API_BASE_URL } from "@web/config";
import type { ReactNode } from "react";
import superjson from "superjson";
import { createQueryClient } from "./query-client";

export const { TRPCProvider } = createTRPCContext<AppRouter>();

let browserQueryClient: QueryClient;
const getQueryClient = () => {
  if (isServer) {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
};

export const TRPCReactProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();
  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${API_BASE_URL}/trpc`,
        transformer: superjson,
        headers() {
          return {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SG_CARS_TRENDS_API_TOKEN}`,
          };
        },
      }),
    ],
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
};
