"use client";

import { Button } from "@heroui/react";
import Typography from "@web/components/typography";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export const PageNotFound = () => (
  <div className="container mx-auto px-4 py-16">
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-8">
        <Typography.Display className="mb-4 text-primary">
          404
        </Typography.Display>
        <Typography.H1 className="mb-2">Page Not Found</Typography.H1>
        <Typography.BodyLarge className="max-w-md text-foreground-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography.BodyLarge>
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

      <Typography.BodySmall className="mt-8 text-foreground-500">
        Need help? Visit our{" "}
        <Link href="/faq" className="text-primary hover:underline">
          FAQ page
        </Link>{" "}
        or go back to the{" "}
        <Link href="/" className="text-primary hover:underline">
          homepage
        </Link>
        .
      </Typography.BodySmall>
    </div>
  </div>
);
