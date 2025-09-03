import {
  type BannerAction,
  type BannerState,
  createBannerSlice,
} from "@web/app/store/banner-slice";
import {
  type COEAction,
  type COEState,
  createCoeSlice,
} from "@web/app/store/coe-slice";
import {
  createDateSlice,
  type DateAction,
  type DateState,
} from "@web/app/store/date-slice";
import {
  createNotificationSlice,
  type NotificationAction,
  type NotificationState,
} from "@web/app/store/notification-slice";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = DateState & COEState & NotificationState & BannerState;
type Action = DateAction & COEAction & NotificationAction & BannerAction;

const useStore = create<State & Action, [["zustand/persist", unknown]]>(
  persist(
    (...a) => ({
      ...createDateSlice(...a),
      ...createCoeSlice(...a),
      ...createNotificationSlice(...a),
      ...createBannerSlice(...a),
    }),
    {
      name: "config",
      partialize: ({ categories, notificationStatus }) => ({
        categories,
        notificationStatus,
      }),
    },
  ),
);

export default useStore;
