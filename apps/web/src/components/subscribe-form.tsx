"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { subscribeAction } from "@web/actions";
import { Mail } from "lucide-react";

export function SubscribeForm() {
  return (
    <form
      action={async (formData) => {
        const { data } = await subscribeAction(formData);

        if (data) {
          addToast({
            title: "Success",
            description: "Successfully subscribed to newsletter!",
            color: "success",
            shouldShowTimeoutProgress: true,
          });
        } else {
          addToast({
            title: "Error",
            description: "Failed to subscribe",
            color: "danger",
            shouldShowTimeoutProgress: true,
          });
        }
      }}
      className="flex w-full flex-col gap-2 lg:max-w-fit lg:flex-row"
    >
      <Input
        type="email"
        id="email"
        name="email"
        autoComplete="email"
        placeholder="john.doe@example.com"
        radius="full"
        startContent={<Mail size={16} />}
        variant="bordered"
        required
      />
      <Button type="submit" color="primary" radius="full" variant="shadow">
        Subscribe
      </Button>
    </form>
  );
}
