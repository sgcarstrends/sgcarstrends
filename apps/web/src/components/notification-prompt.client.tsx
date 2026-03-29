"use client";

import { Alert, Button, toast } from "@heroui/react";
import { cn } from "@sgcarstrends/ui/lib/utils";
import useStore from "@web/app/store";
import { useCallback, useEffect } from "react";

interface NotificationPromptClientProps {
  title: string;
  description: string;
  allowLabel: string;
  denyLabel: string;
  enabledToastTitle: string;
  enabledToastDescription: string;
  disabledToastTitle: string;
  disabledToastDescription: string;
}

export function NotificationPromptClient({
  title,
  description,
  allowLabel,
  denyLabel,
  enabledToastTitle,
  enabledToastDescription,
  disabledToastTitle,
  disabledToastDescription,
}: NotificationPromptClientProps) {
  const { notificationStatus, setNotificationStatus } = useStore();

  useEffect(() => {
    if (!("Notification" in window)) {
      return;
    }

    const status = Notification.permission;
    setNotificationStatus(status);
  }, [setNotificationStatus]);

  const handleGranted = useCallback(async () => {
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);

    if (permission === "granted") {
      toast.success(enabledToastTitle, {
        description: enabledToastDescription,
      });
    }
  }, [setNotificationStatus, enabledToastTitle, enabledToastDescription]);

  const handleDenied = useCallback(async () => {
    const permission = await Notification.requestPermission();
    setNotificationStatus(permission);

    if (permission === "denied") {
      toast.warning(disabledToastTitle, {
        description: disabledToastDescription,
      });
    }
  }, [setNotificationStatus, disabledToastTitle, disabledToastDescription]);

  if (notificationStatus === "default") {
    return (
      <Alert
        status="accent"
        className={cn([
          "bg-default-50 shadow-sm dark:bg-background",
          "rounded-md rounded-l-none border border-l-8",
          "border-primary-200 border-l-primary dark:border-primary-100",
        ])}
      >
        <Alert.Content>
          <Alert.Title>{title}</Alert.Title>
          <Alert.Description>{description}</Alert.Description>
        </Alert.Content>
        <div className="flex gap-2">
          <Button onPress={handleGranted} size="sm" variant="primary">
            {allowLabel}
          </Button>
          <Button onPress={handleDenied} size="sm" variant="secondary">
            {denyLabel}
          </Button>
        </div>
      </Alert>
    );
  }

  return null;
}
