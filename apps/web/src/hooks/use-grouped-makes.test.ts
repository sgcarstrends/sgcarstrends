import { renderHook } from "@testing-library/react";
import { useGroupedMakes } from "./use-grouped-makes";

describe("useGroupedMakes", () => {
  const mixedMakes = [
    "VOLKSWAGEN",
    "AUDI",
    "BMW",
    "MERCEDES BENZ",
    "123MOTORS",
    "PORSCHE",
  ];

  it("should sort makes alphabetically", () => {
    const { result } = renderHook(() => useGroupedMakes(mixedMakes));

    expect(result.current.sortedMakes).toEqual([
      "123MOTORS",
      "AUDI",
      "BMW",
      "MERCEDES BENZ",
      "PORSCHE",
      "VOLKSWAGEN",
    ]);
  });

  it("should group makes by first letter", () => {
    const { result } = renderHook(() => useGroupedMakes(mixedMakes));

    expect(result.current.groupedMakes).toEqual({
      "#": ["123MOTORS"],
      A: ["AUDI"],
      B: ["BMW"],
      M: ["MERCEDES BENZ"],
      P: ["PORSCHE"],
      V: ["VOLKSWAGEN"],
    });
  });

  it("should create letters array with ALL first and # last", () => {
    const { result } = renderHook(() => useGroupedMakes(mixedMakes));

    expect(result.current.letters).toEqual([
      "ALL",
      "A",
      "B",
      "M",
      "P",
      "V",
      "#",
    ]);
  });

  it("should handle empty makes array", () => {
    const { result } = renderHook(() => useGroupedMakes([]));

    expect(result.current.sortedMakes).toEqual([]);
    expect(result.current.groupedMakes).toEqual({});
    expect(result.current.letters).toEqual(["ALL"]);
  });

  it("should handle makes starting with numbers", () => {
    const numberMakes = ["7-ELEVEN", "3M", "BMW"];
    const { result } = renderHook(() => useGroupedMakes(numberMakes));

    expect(result.current.groupedMakes["#"]).toEqual(["3M", "7-ELEVEN"]);
    expect(result.current.groupedMakes.B).toEqual(["BMW"]);
  });

  it("should handle whitespace in make names", () => {
    const whitespaceMakes = [" AUDI ", "BMW", "  MERCEDES BENZ  "];
    const { result } = renderHook(() => useGroupedMakes(whitespaceMakes));

    expect(result.current.groupedMakes.A).toEqual([" AUDI "]);
    expect(result.current.groupedMakes.M).toEqual(["  MERCEDES BENZ  "]);
  });
});
