import { sortAscendingDates, sortDescendingDates } from "@/utils/sort-dates";

describe("sortDates", () => {
  const testDates = [
    new Date(2022, 5, 15),
    new Date(2023, 2, 1),
    new Date(2021, 11, 31),
    new Date(2023, 0, 1),
    new Date(2022, 0, 1),
  ];

  describe("sortAscendingDates", () => {
    it("should sort dates in ascending order", () => {
      const sortedDates = sortAscendingDates(testDates);
      expect(sortedDates).toEqual([
        new Date(2021, 11, 31),
        new Date(2022, 0, 1),
        new Date(2022, 5, 15),
        new Date(2023, 0, 1),
        new Date(2023, 2, 1),
      ]);
    });

    it("should return a new array", () => {
      const sortedDates = sortAscendingDates(testDates);
      expect(sortedDates).not.toBe(testDates);
    });

    it("should handle an empty array", () => {
      const emptyArray: Date[] = [];
      const sortedDates = sortAscendingDates(emptyArray);
      expect(sortedDates).toEqual([]);
    });

    it("should handle an array with one date", () => {
      const singleDateArray = [new Date(2022, 0, 1)];
      const sortedDates = sortAscendingDates(singleDateArray);
      expect(sortedDates).toEqual(singleDateArray);
    });
  });

  describe("sortDescendingDates", () => {
    it("should sort dates in descending order", () => {
      const sortedDates = sortDescendingDates(testDates);
      expect(sortedDates).toEqual([
        new Date(2023, 2, 1),
        new Date(2023, 0, 1),
        new Date(2022, 5, 15),
        new Date(2022, 0, 1),
        new Date(2021, 11, 31),
      ]);
    });

    it("should return a new array", () => {
      const sortedDates = sortDescendingDates(testDates);
      expect(sortedDates).not.toBe(testDates);
    });

    it("should handle an empty array", () => {
      const emptyArray: Date[] = [];
      const sortedDates = sortDescendingDates(emptyArray);
      expect(sortedDates).toEqual([]);
    });

    it("should handle an array with one date", () => {
      const singleDateArray = [new Date(2022, 0, 1)];
      const sortedDates = sortDescendingDates(singleDateArray);
      expect(sortedDates).toEqual(singleDateArray);
    });
  });
});
