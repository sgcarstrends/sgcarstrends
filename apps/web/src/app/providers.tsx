"use client";

import type { ReactNode } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

export const Providers = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  return (
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
  );
};
