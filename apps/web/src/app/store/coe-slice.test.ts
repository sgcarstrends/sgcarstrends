import { create } from "zustand";
import { type COEAction, type COEState, createCoeSlice } from "./coe-slice";

describe("COE Slice", () => {
  it("should initialize with default categories", () => {
    const store = create<COEState & COEAction>()(createCoeSlice);
    const state = store.getState();

    expect(state.categories).toEqual({
      "Category A": true,
      "Category B": true,
      "Category C": false,
      "Category D": false,
      "Category E": true,
    });
  });

  it("should toggle category status when updateCategories is called", () => {
    const store = create<COEState & COEAction>()(createCoeSlice);
    const { updateCategories } = store.getState();

    // Initially Category A is true
    expect(store.getState().categories["Category A"]).toBe(true);

    // Toggle Category A
    updateCategories("Category A");
    expect(store.getState().categories["Category A"]).toBe(false);

    // Toggle Category A again
    updateCategories("Category A");
    expect(store.getState().categories["Category A"]).toBe(true);
  });

  it("should toggle category C from false to true", () => {
    const store = create<COEState & COEAction>()(createCoeSlice);
    const { updateCategories } = store.getState();

    // Initially Category C is false
    expect(store.getState().categories["Category C"]).toBe(false);

    // Toggle Category C
    updateCategories("Category C");
    expect(store.getState().categories["Category C"]).toBe(true);
  });

  it("should not affect other categories when toggling one", () => {
    const store = create<COEState & COEAction>()(createCoeSlice);
    const { updateCategories } = store.getState();

    const initialState = store.getState().categories;

    // Toggle Category A
    updateCategories("Category A");

    const newState = store.getState().categories;

    // Category A should be toggled
    expect(newState["Category A"]).toBe(!initialState["Category A"]);

    // Other categories should remain unchanged
    expect(newState["Category B"]).toBe(initialState["Category B"]);
    expect(newState["Category C"]).toBe(initialState["Category C"]);
    expect(newState["Category D"]).toBe(initialState["Category D"]);
    expect(newState["Category E"]).toBe(initialState["Category E"]);
  });
});
