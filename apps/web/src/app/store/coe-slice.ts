import type { COECategory, COECategoryFilter } from "@web/types";
import type { StateCreator } from "zustand";

export type COEState = {
  categories: COECategoryFilter;
};

export type COEAction = {
  updateCategories: (category: COECategory) => void;
};

const defaultCategories: COECategoryFilter = {
  "Category A": true,
  "Category B": true,
  "Category C": false,
  "Category D": false,
  "Category E": true,
};

export const createCoeSlice: StateCreator<COEState & COEAction> = (set) => ({
  categories: defaultCategories,
  updateCategories: (category) =>
    set(({ categories }) => ({
      categories: {
        ...categories,
        [category]: !categories[category],
      },
    })),
});
