"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { TRPCReactProvider } from "@web/trpc/client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
    <TRPCReactProvider>
      <HeroUIProvider navigate={router.push}>
        <ToastProvider
          placement="top-right"
          toastProps={{
            timeout: 6000,
            hideCloseButton: false,
          }}
        />
        {children}
      </HeroUIProvider>
    </TRPCReactProvider>
  );
};
