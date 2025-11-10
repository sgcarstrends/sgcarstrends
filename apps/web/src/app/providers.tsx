"use client";

import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import type { ReactNode } from "react";
import { useEffect } from "react";

export const Providers = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  return (
    <PHProvider client={posthog}>
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
    </PHProvider>
  );
};
