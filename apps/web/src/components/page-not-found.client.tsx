"use client";

import { Button } from "@heroui/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export function NavigationButtons() {
  return (
    <div className="mb-12 flex flex-col gap-4 sm:flex-row">
      <Button
        as={Link}
        href="/"
        color="primary"
        variant="solid"
        startContent={<Home className="size-4" />}
        size="lg"
      >
        Go to Homepage
      </Button>
      <Button
        variant="bordered"
        onPress={() => window.history.back()}
        startContent={<ArrowLeft className="size-4" />}
        size="lg"
      >
        Go Back
      </Button>
    </div>
  );
}
