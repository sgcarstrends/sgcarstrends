import type { StateCreator } from "zustand";

export type NotificationState = {
  notificationStatus: typeof Notification.permission | undefined;
};

export type NotificationAction = {
  setNotificationStatus: (status: typeof Notification.permission) => void;
};

export const createNotificationSlice: StateCreator<
  NotificationState & NotificationAction
> = (set) => ({
  notificationStatus: undefined,
  setNotificationStatus: (status) => set({ notificationStatus: status }),
});
