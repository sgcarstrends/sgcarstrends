import {
  type BannerAction,
  type BannerState,
  createBannerSlice,
} from "@web/app/store/banner-slice";
import {
  createNotificationSlice,
  type NotificationAction,
  type NotificationState,
} from "@web/app/store/notification-slice";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = NotificationState & BannerState;
type Action = NotificationAction & BannerAction;

const useStore = create<State & Action, [["zustand/persist", unknown]]>(
  persist(
    (...a) => ({
      ...createNotificationSlice(...a),
      ...createBannerSlice(...a),
    }),
    {
      name: "config",
      partialize: ({ notificationStatus }) => ({
        notificationStatus,
      }),
    },
  ),
);

export default useStore;
