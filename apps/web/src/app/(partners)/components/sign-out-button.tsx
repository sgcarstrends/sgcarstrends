"use client";

import { Button } from "@heroui/button";
import { partnerAuthClient } from "@web/app/(partners)/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await partnerAuthClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to sign out");
        },
      },
    });
  }

  return (
    <Button
      variant="light"
      className="w-full justify-start"
      startContent={<LogOut className="size-4" />}
      onPress={handleSignOut}
    >
      Sign Out
    </Button>
  );
}
