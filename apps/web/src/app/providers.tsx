"use client";

import { ToastProvider } from "@heroui/toast";
import type { ReactNode } from "react";

export function Providers({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <ToastProvider
        placement="top-right"
        toastProps={{
          timeout: 6000,
          hideCloseButton: false,
        }}
      />
      {children}
    </>
  );
}
