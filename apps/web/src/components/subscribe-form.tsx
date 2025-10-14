"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { subscribeAction } from "@web/actions/subscribe-action";
import { Mail } from "lucide-react";

console.log(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export const SubscribeForm = () => {
  return (
    <form
      action={async (formData) => {
        const { data, error } = await subscribeAction(formData);

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
            description: error?.message || "Failed to subscribe",
            color: "danger",
            shouldShowTimeoutProgress: true,
          });
        }
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2 lg:flex-row">
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email"
          radius="full"
          startContent={<Mail size={16} />}
          variant="bordered"
          required
        />
        <Button type="submit" color="primary" radius="full" variant="shadow">
          Subscribe
        </Button>
      </div>
      <div
        className="cf-turnstile"
        data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
        data-theme="auto"
      />
    </form>
  );
};
