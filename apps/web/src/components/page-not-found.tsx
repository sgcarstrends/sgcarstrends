"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowLeft, Home } from "lucide-react";

export const PageNotFound = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-8">
        <div className="text-primary mb-4 text-6xl font-bold">404</div>
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          Page Not Found
        </h1>
        <p className="text-foreground-500 max-w-md text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

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

      <div className="text-foreground-500 mt-8 text-sm">
        Need help? Visit our{" "}
        <Link href="/faq" className="text-primary hover:underline">
          FAQ page
        </Link>{" "}
        or go back to the{" "}
        <Link href="/" className="text-primary hover:underline">
          homepage
        </Link>
        .
      </div>
    </div>
  </div>
);
