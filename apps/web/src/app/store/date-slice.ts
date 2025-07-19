import type { StateCreator } from "zustand";

export type DateState = {
  selectedMonth: string;
  selectedYear: string;
};

export type DateAction = {
  setSelectedMonth: (month: string) => void;
  setSelectedYear: (year: string) => void;
};

export const createDateSlice: StateCreator<DateState & DateAction> = (set) => ({
  selectedMonth: "",
  selectedYear: (new Date().getFullYear() - 1).toString(),
  setSelectedMonth: (selectedMonth) => set(() => ({ selectedMonth })),
  setSelectedYear: (selectedYear) => set(() => ({ selectedYear })),
});
