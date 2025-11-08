/**
 * Get top N items from an array based on a sort function
 * @param array - Array of items
 * @param n - Number of top items to return
 * @param sortFn - Function to compare two items (return negative if a < b, positive if a > b)
 * @returns Array of top N items
 * @example
 * const data = [{ name: 'A', value: 10 }, { name: 'B', value: 30 }, { name: 'C', value: 20 }];
 * topN(data, 2, (a, b) => b.value - a.value)
 * // returns [{ name: 'B', value: 30 }, { name: 'C', value: 20 }]
 */
export const topN = <T>(
  array: T[],
  n: number,
  sortFn: (a: T, b: T) => number,
): T[] => {
  return [...array].sort(sortFn).slice(0, n);
};

/**
 * Group an array of items by a key extracted from each item
 * @param array - Array of items to group
 * @param keyFn - Function to extract grouping key from each item
 * @returns Record mapping keys to arrays of items
 * @example
 * const data = [
 *   { category: 'A', value: 10 },
 *   { category: 'B', value: 20 },
 *   { category: 'A', value: 30 }
 * ];
 * groupBy(data, item => item.category)
 * // returns { A: [{ category: 'A', value: 10 }, { category: 'A', value: 30 }], B: [...] }
 */
export const groupBy = <T>(
  array: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> => {
  return array.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Sort an array by a specific field
 * @param array - Array of items
 * @param field - Field name to sort by (or function to extract sort value)
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns Sorted array
 * @example
 * const data = [{ name: 'B', value: 20 }, { name: 'A', value: 10 }];
 * sortByField(data, 'value', 'asc')
 * // returns [{ name: 'A', value: 10 }, { name: 'B', value: 20 }]
 */
export const sortByField = <T>(
  array: T[],
  field: keyof T | ((item: T) => number | string),
  direction: "asc" | "desc" = "asc",
): T[] => {
  const getValue = (item: T): number | string => {
    if (typeof field === "function") {
      return field(item);
    }
    const value = item[field];
    if (typeof value === "number" || typeof value === "string") {
      return value;
    }
    return String(value);
  };

  return [...array].sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (typeof valueA === "number" && typeof valueB === "number") {
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    const stringA = String(valueA);
    const stringB = String(valueB);
    return direction === "asc"
      ? stringA.localeCompare(stringB)
      : stringB.localeCompare(stringA);
  });
};
