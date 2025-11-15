import type { ReactNode } from "react";
import { vi } from "vitest";

type StoreState = {
  bannerContent: ReactNode | null;
  setBannerContent: ReturnType<typeof vi.fn>;
  categories: Record<string, boolean>;
};

type UseStoreMock = {
  state: StoreState;
  useStore: <T>(
    selector?: (state: StoreState) => T,
    _equalityFn?: (a: T, b: T) => boolean,
  ) => T | StoreState;
};

export const createUseStoreMock = (): UseStoreMock => {
  const state: StoreState = {
    bannerContent: null,
    setBannerContent: vi.fn(),
    categories: {
      "Category A": true,
      "Category B": true,
      "Category C": true,
      "Category D": true,
      "Category E": true,
    },
  };

  const useStore: UseStoreMock["useStore"] = (selector) => {
    if (selector) {
      return selector(state);
    }
    return state;
  };

  return { state, useStore };
};
