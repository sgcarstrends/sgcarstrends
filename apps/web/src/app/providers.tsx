"use client";

import type { ReactNode } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
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
  );
};
