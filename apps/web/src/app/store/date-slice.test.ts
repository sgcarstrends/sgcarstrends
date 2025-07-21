import { create } from "zustand";
import { createDateSlice, type DateState, type DateAction } from "./date-slice";

describe("Date Slice", () => {
  it("should initialize with correct default values", () => {
    const store = create<DateState & DateAction>()(createDateSlice);
    const state = store.getState();

    expect(state.selectedMonth).toBe("");
    expect(state.selectedYear).toBe((new Date().getFullYear() - 1).toString());
  });

  it("should update selected month", () => {
    const store = create<DateState & DateAction>()(createDateSlice);
    const { setSelectedMonth } = store.getState();

    setSelectedMonth("03");
    expect(store.getState().selectedMonth).toBe("03");

    setSelectedMonth("12");
    expect(store.getState().selectedMonth).toBe("12");
  });

  it("should update selected year", () => {
    const store = create<DateState & DateAction>()(createDateSlice);
    const { setSelectedYear } = store.getState();

    setSelectedYear("2023");
    expect(store.getState().selectedYear).toBe("2023");

    setSelectedYear("2024");
    expect(store.getState().selectedYear).toBe("2024");
  });

  it("should set month and year independently", () => {
    const store = create<DateState & DateAction>()(createDateSlice);
    const { setSelectedMonth, setSelectedYear } = store.getState();

    // Set month without affecting year
    const initialYear = store.getState().selectedYear;
    setSelectedMonth("06");

    expect(store.getState().selectedMonth).toBe("06");
    expect(store.getState().selectedYear).toBe(initialYear);

    // Set year without affecting month
    setSelectedYear("2025");

    expect(store.getState().selectedMonth).toBe("06");
    expect(store.getState().selectedYear).toBe("2025");
  });

  it("should handle empty string for month", () => {
    const store = create<DateState & DateAction>()(createDateSlice);
    const { setSelectedMonth } = store.getState();

    setSelectedMonth("01");
    expect(store.getState().selectedMonth).toBe("01");

    setSelectedMonth("");
    expect(store.getState().selectedMonth).toBe("");
  });
});
