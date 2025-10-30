/**
 * Calculate percentage from count and total
 * @param count - The count value
 * @param total - The total value
 * @returns Percentage value (0-100)
 * @example calculatePercentage(25, 100) // returns 25
 */
export const calculatePercentage = (count: number, total: number): number => {
  if (total === 0) return 0;
  return (count / total) * 100;
};

/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change
 * @example calculateChangePercentage(120, 100) // returns 20
 */
export const calculateChangePercentage = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Statistics result containing min, max, average, sum, and count
 */
export interface Stats {
  min: number;
  max: number;
  average: number;
  sum: number;
  count: number;
}

/**
 * Calculate statistics (min, max, average, sum) for an array
 * @param array - Array of items
 * @param valueFn - Function to extract numeric value from each item
 * @returns Statistics object with min, max, average, sum, count
 * @example
 * const data = [{ value: 10 }, { value: 20 }, { value: 30 }];
 * calculateStats(data, item => item.value)
 * // returns { min: 10, max: 30, average: 20, sum: 60, count: 3 }
 */
export const calculateStats = <T>(
  array: T[],
  valueFn: (item: T) => number,
): Stats => {
  if (array.length === 0) {
    return { min: 0, max: 0, average: 0, sum: 0, count: 0 };
  }

  const values = array.map(valueFn);
  const sum = values.reduce((acc, val) => acc + val, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const average = sum / values.length;

  return {
    min,
    max,
    average,
    sum,
    count: array.length,
  };
};

/**
 * Result containing min and max items from an array
 */
export interface MinMax<T> {
  min: number;
  max: number;
  minItem: T;
  maxItem: T;
}

/**
 * Find minimum and maximum values along with their corresponding items
 * @param array - Array of items
 * @param valueFn - Function to extract numeric value from each item
 * @returns Object containing min, max values and their corresponding items
 * @example
 * const data = [{ name: 'A', value: 10 }, { name: 'B', value: 30 }];
 * findMinMax(data, item => item.value)
 * // returns { min: 10, max: 30, minItem: { name: 'A', value: 10 }, maxItem: { name: 'B', value: 30 } }
 */
export const findMinMax = <T>(
  array: T[],
  valueFn: (item: T) => number,
): MinMax<T> | null => {
  if (array.length === 0) {
    return null;
  }

  let minItem = array[0];
  let maxItem = array[0];
  let minValue = valueFn(array[0]);
  let maxValue = valueFn(array[0]);

  for (const item of array) {
    const value = valueFn(item);
    if (value < minValue) {
      minValue = value;
      minItem = item;
    }
    if (value > maxValue) {
      maxValue = value;
      maxItem = item;
    }
  }

  return {
    min: minValue,
    max: maxValue,
    minItem,
    maxItem,
  };
};
