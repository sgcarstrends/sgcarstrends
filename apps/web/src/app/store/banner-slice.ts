import type { ReactNode } from "react";
import type { StateCreator } from "zustand";

export type BannerState = {
  bannerContent: ReactNode | null;
};

export type BannerAction = {
  setBannerContent: (content: ReactNode | null) => void;
};

export const createBannerSlice: StateCreator<BannerState & BannerAction> = (
  set,
) => ({
  bannerContent: null,
  setBannerContent: (bannerContent) => set({ bannerContent }),
});
