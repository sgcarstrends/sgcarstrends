"use client";

import type { ReactNode } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { TRPCProvider } from "@/trpc/provider";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <TRPCProvider>
      <HeroUIProvider>
        <ToastProvider
          placement="top-right"
          toastProps={{
            timeout: 6000,
            hideCloseButton: false,
          }}
        />
        {children}
      </HeroUIProvider>
    </TRPCProvider>
  );
};
