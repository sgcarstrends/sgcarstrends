export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC",
}

type SortOptions<T> = {
  sortKey: keyof T;
  direction?: SortDirection;
};

const sortBy =
  <T>(compareFn: (a: T, b: T, key: keyof T) => number) =>
  (options: SortOptions<T>) =>
  (a: T, b: T) => {
    const diff = compareFn(a, b, options.sortKey);
    const direction = options.direction ?? SortDirection.ASC;
    return direction === SortDirection.ASC ? diff : -diff;
  };

export const sortByName = <T>(data: T[], options: SortOptions<T>) =>
  data.toSorted(
    sortBy<T>((a, b, key) => String(a[key]).localeCompare(String(b[key])))(
      options,
    ),
  );

export const sortByValue = <T>(data: T[], options: SortOptions<T>) =>
  data.toSorted(
    sortBy<T>((a, b, key) => Number(a[key]) - Number(b[key]))(options),
  );
