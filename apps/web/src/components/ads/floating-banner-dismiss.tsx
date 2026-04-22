"use client";

import { Button } from "@heroui/button";
import { X } from "lucide-react";
import { useState } from "react";

export function FloatingBannerDismiss() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      aria-label="Dismiss banner"
      onPress={() => setDismissed(true)}
    >
      <X className="size-4" />
    </Button>
  );
}
