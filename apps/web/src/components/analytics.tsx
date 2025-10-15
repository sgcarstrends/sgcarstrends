"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const Analytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    const url = "/api/analytics";
    const body = JSON.stringify({ pathname, referrer: document.referrer });

    // Use fetch with keepalive option as a fallback for sendBeacon
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      void fetch(url, { method: "POST", body, keepalive: true });
    }
  }, [pathname]);

  return null;
};
