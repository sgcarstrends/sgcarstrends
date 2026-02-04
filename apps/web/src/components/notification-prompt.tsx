import { NotificationPromptClient } from "./notification-prompt.client";

export function NotificationPrompt() {
  return (
    <NotificationPromptClient
      title="Enable Notifications?"
      description="Stay updated with the latest news and alerts by enabling browser notifications"
      allowLabel="Allow"
      denyLabel="Deny"
      enabledToastTitle="Notifications Enabled!"
      enabledToastDescription="You will now receive updates and alerts whenever new data is published"
      disabledToastTitle="Notifications Disabled!"
      disabledToastDescription="You will not receive updates and alerts whenever new data is published"
    />
  );
}
