import { vi } from "vitest";

type ResultFactory<T> = T | (() => T | Promise<T>);

const resolveFactory = async <T>(factory: ResultFactory<T>): Promise<T> => {
  if (typeof factory === "function") {
    return (factory as () => T | Promise<T>)();
  }
  return factory;
};

const createQueryBuilder = <T>(factory: ResultFactory<T>) => {
  const builder: Record<string, (...args: unknown[]) => typeof builder> & {
    then: (
      onFulfilled?: (value: T) => unknown,
      onRejected?: (reason: unknown) => unknown,
    ) => Promise<unknown>;
  } = {
    from: () => builder,
    where: () => builder,
    groupBy: () => builder,
    orderBy: () => builder,
    limit: () => builder,
    innerJoin: () => builder,
    leftJoin: () => builder,
    having: () => builder,
    // biome-ignore lint/suspicious/noThenProperty: Required to make query builder thenable for async/await syntax
    then: (onFulfilled, onRejected) =>
      Promise.resolve(resolveFactory(factory)).then(onFulfilled, onRejected),
  };

  return builder;
};

const selectQueue: ResultFactory<unknown>[] = [];
const selectDistinctQueue: ResultFactory<unknown>[] = [];

const dequeue = (queue: ResultFactory<unknown>[]) => {
  const factory = queue.shift() ?? [];
  return createQueryBuilder(factory);
};

const mockDb = {
  select: vi.fn(() => dequeue(selectQueue)),
  selectDistinct: vi.fn(() => dequeue(selectDistinctQueue)),
  query: {
    cars: {
      findFirst: vi.fn(),
    },
  },
};

vi.mock("@sgcarstrends/database", () => ({
  db: mockDb,
  cars: {},
  coe: {},
  pqp: {},
}));

export const cacheLifeMock = vi.fn();
export const cacheTagMock = vi.fn();

vi.mock("next/cache", () => ({
  cacheLife: cacheLifeMock,
  cacheTag: cacheTagMock,
}));

export const queueSelect = (...results: ResultFactory<unknown>[]) => {
  selectQueue.push(...results);
};

export const queueSelectDistinct = (...results: ResultFactory<unknown>[]) => {
  selectDistinctQueue.push(...results);
};

export const resetDbMocks = () => {
  selectQueue.length = 0;
  selectDistinctQueue.length = 0;
  mockDb.select.mockReset();
  mockDb.selectDistinct.mockReset();
  mockDb.query.cars.findFirst.mockReset();
  cacheLifeMock.mockReset();
  cacheTagMock.mockReset();
};

export const dbMock = mockDb;
