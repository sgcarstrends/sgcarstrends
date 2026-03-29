"use client";

import { Button, Link } from "@heroui/react";
import { ArrowLeft, Home } from "lucide-react";

export function NavigationButtons() {
  return (
    <div className="mb-12 flex flex-col gap-4 sm:flex-row">
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 rounded-medium bg-primary px-6 py-3 font-medium text-lg text-primary-foreground"
      >
        <Home className="size-4" />
        Go to Homepage
      </Link>
      <Button
        variant="secondary"
        onPress={() => window.history.back()}
        size="lg"
      >
        <ArrowLeft className="size-4" />
        Go Back
      </Button>
    </div>
  );
}
