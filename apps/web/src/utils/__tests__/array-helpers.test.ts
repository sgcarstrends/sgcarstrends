import { describe, expect, it } from "vitest";
import { groupBy, sortByField, topN } from "../array-helpers";

describe("topN", () => {
  it("should return top N items in descending order", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 30 },
      { name: "C", value: 20 },
      { name: "D", value: 40 },
    ];
    const result = topN(data, 2, (a, b) => b.value - a.value);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "D", value: 40 });
    expect(result[1]).toEqual({ name: "B", value: 30 });
  });

  it("should return top N items in ascending order", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 30 },
      { name: "C", value: 20 },
    ];
    const result = topN(data, 2, (a, b) => a.value - b.value);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "A", value: 10 });
    expect(result[1]).toEqual({ name: "C", value: 20 });
  });

  it("should return all items if N is greater than array length", () => {
    const data = [{ value: 10 }, { value: 20 }];
    const result = topN(data, 10, (a, b) => b.value - a.value);

    expect(result).toHaveLength(2);
  });

  it("should return empty array if N is 0", () => {
    const data = [{ value: 10 }, { value: 20 }];
    const result = topN(data, 0, (a, b) => b.value - a.value);

    expect(result).toHaveLength(0);
  });

  it("should not mutate original array", () => {
    const data = [{ value: 3 }, { value: 1 }, { value: 2 }];
    const original = [...data];
    topN(data, 2, (a, b) => a.value - b.value);

    expect(data).toEqual(original);
  });

  it("should work with primitive values", () => {
    const data = [5, 2, 8, 1, 9, 3];
    const result = topN(data, 3, (a, b) => b - a);

    expect(result).toEqual([9, 8, 5]);
  });
});

describe("groupBy", () => {
  it("should group items by key", () => {
    const data = [
      { category: "A", value: 10 },
      { category: "B", value: 20 },
      { category: "A", value: 30 },
      { category: "C", value: 40 },
    ];
    const result = groupBy(data, (item) => item.category);

    expect(result.A).toHaveLength(2);
    expect(result.B).toHaveLength(1);
    expect(result.C).toHaveLength(1);
    expect(result.A[0].value).toBe(10);
    expect(result.A[1].value).toBe(30);
  });

  it("should handle empty array", () => {
    const result = groupBy([], (item) => item.toString());
    expect(result).toEqual({});
  });

  it("should handle single group", () => {
    const data = [
      { type: "same", value: 1 },
      { type: "same", value: 2 },
    ];
    const result = groupBy(data, (item) => item.type);

    expect(Object.keys(result)).toHaveLength(1);
    expect(result.same).toHaveLength(2);
  });

  it("should work with composite keys", () => {
    const data = [
      { month: "2024-01", category: "A", value: 10 },
      { month: "2024-01", category: "B", value: 20 },
      { month: "2024-02", category: "A", value: 30 },
    ];
    const result = groupBy(data, (item) => `${item.month}-${item.category}`);

    expect(Object.keys(result)).toHaveLength(3);
    expect(result["2024-01-A"]).toHaveLength(1);
    expect(result["2024-01-B"]).toHaveLength(1);
    expect(result["2024-02-A"]).toHaveLength(1);
  });

  it("should work with primitive values", () => {
    const data = ["apple", "banana", "apricot", "blueberry"];
    const result = groupBy(data, (item) => item[0]);

    expect(result.a).toHaveLength(2);
    expect(result.b).toHaveLength(2);
  });
});

describe("sortByField", () => {
  it("should sort by field in ascending order", () => {
    const data = [
      { name: "C", value: 30 },
      { name: "A", value: 10 },
      { name: "B", value: 20 },
    ];
    const result = sortByField(data, "value", "asc");

    expect(result[0].value).toBe(10);
    expect(result[1].value).toBe(20);
    expect(result[2].value).toBe(30);
  });

  it("should sort by field in descending order", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "C", value: 30 },
      { name: "B", value: 20 },
    ];
    const result = sortByField(data, "value", "desc");

    expect(result[0].value).toBe(30);
    expect(result[1].value).toBe(20);
    expect(result[2].value).toBe(10);
  });

  it("should sort by string field", () => {
    const data = [
      { name: "Charlie", age: 25 },
      { name: "Alice", age: 30 },
      { name: "Bob", age: 20 },
    ];
    const result = sortByField(data, "name", "asc");

    expect(result[0].name).toBe("Alice");
    expect(result[1].name).toBe("Bob");
    expect(result[2].name).toBe("Charlie");
  });

  it("should sort using custom function", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "B", value: 30 },
      { name: "C", value: 20 },
    ];
    const result = sortByField(data, (item) => item.value * 2, "desc");

    expect(result[0].name).toBe("B");
    expect(result[1].name).toBe("C");
    expect(result[2].name).toBe("A");
  });

  it("should default to ascending order", () => {
    const data = [{ value: 3 }, { value: 1 }, { value: 2 }];
    const result = sortByField(data, "value");

    expect(result[0].value).toBe(1);
    expect(result[1].value).toBe(2);
    expect(result[2].value).toBe(3);
  });

  it("should not mutate original array", () => {
    const data = [{ value: 3 }, { value: 1 }, { value: 2 }];
    const original = [...data];
    sortByField(data, "value", "asc");

    expect(data).toEqual(original);
  });

  it("should convert non-primitive values to string for sorting", () => {
    const data = [
      { name: "A", active: true },
      { name: "B", active: false },
      { name: "C", active: true },
    ];
    const result = sortByField(data, "active", "asc");

    expect(result[0].active).toBe(false);
    expect(result[1].active).toBe(true);
  });
});
