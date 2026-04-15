"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  sendMagicLink,
  type SendMagicLinkState,
} from "@web/app/(partners)/actions/auth";
import { Mail } from "lucide-react";
import { useActionState } from "react";

const initialState: SendMagicLinkState = {};

export function MagicLinkForm() {
  const [state, formAction, pending] = useActionState(
    sendMagicLink,
    initialState,
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-success/10">
          <Mail className="size-6 text-success" />
        </div>
        <h2 className="font-semibold text-xl">Check your email</h2>
        <p className="text-default-500 text-sm">
          We sent a sign-in link to <strong>{state.email}</strong>
        </p>
        <p className="text-default-500 text-sm">
          Click the link in your email to sign in.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Input
        type="email"
        name="email"
        label="Email"
        placeholder="you@company.com"
        isRequired
        isInvalid={!!state.errors?.email}
        errorMessage={state.errors?.email?.[0]}
        startContent={<Mail className="size-4 text-default-400" />}
      />
      <Button type="submit" color="primary" isLoading={pending}>
        {pending ? "Sending..." : "Send Sign-In Link"}
      </Button>
    </form>
  );
}
