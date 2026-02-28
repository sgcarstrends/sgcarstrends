import type { SortDescriptor } from "@heroui/table";

export function sortByDescriptor<T extends Record<string, unknown>>(
  data: T[],
  descriptor: SortDescriptor,
): T[] {
  return [...data].sort((a, b) => {
    const column = descriptor.column as keyof T;
    const first = a[column];
    const second = b[column];

    if (typeof first === "number" && typeof second === "number") {
      return descriptor.direction === "ascending"
        ? first - second
        : second - first;
    }

    return descriptor.direction === "ascending"
      ? String(first).localeCompare(String(second))
      : String(second).localeCompare(String(first));
  });
}
