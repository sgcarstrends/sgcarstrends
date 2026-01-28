---
name: api-testing
description: Write and run API tests with Vitest for endpoints, middleware, and integrations. Use when testing API functionality, request/response validation, or error handling.
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# API Testing Skill

## Running Tests

```bash
pnpm -F @sgcarstrends/api test              # Run all API tests
pnpm -F @sgcarstrends/api test routes/      # Run specific folder
pnpm -F @sgcarstrends/api test:watch        # Watch mode
pnpm -F @sgcarstrends/api test:coverage     # With coverage
```

## Test Structure

```
apps/api/__tests__/
├── setup.ts              # Test setup
├── helpers.ts            # Test utilities
├── routes/               # Endpoint tests
│   ├── cars.test.ts
│   └── health.test.ts
├── middleware/           # Middleware tests
└── workflows/            # Workflow tests
```

## Testing Hono Endpoints

### Basic Endpoint Test

```typescript
import { describe, it, expect } from "vitest";
import app from "../../src/index";

describe("GET /health", () => {
  it("returns 200 OK", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
```

### Testing with Query Params

```typescript
describe("GET /api/v1/cars/makes", () => {
  it("filters by month", async () => {
    const res = await app.request("/api/v1/cars/makes?month=2024-01");
    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid month", async () => {
    const res = await app.request("/api/v1/cars/makes?month=invalid");
    expect(res.status).toBe(400);
  });
});
```

### Testing POST Endpoints

```typescript
describe("POST /api/v1/blog/posts", () => {
  it("creates a new post", async () => {
    const res = await app.request("/api/v1/blog/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Test", content: "Content" }),
    });
    expect(res.status).toBe(201);
  });
});
```

## Mocking

### Mock Database

```typescript
import { vi } from "vitest";
import { db } from "../src/config/database";

vi.spyOn(db.query.cars, "findMany").mockResolvedValue([
  { make: "Toyota", model: "Corolla", number: 100 },
]);
```

### Mock External APIs

```typescript
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ records: [] }),
});
global.fetch = mockFetch;
```

### Mock Redis

```typescript
vi.mock("@sgcarstrends/utils", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));
```

## Test Helpers

```typescript
// apps/api/__tests__/helpers.ts
export const createAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const seedDatabase = async (data: any[]) => {
  await db.insert(cars).values(data);
};

export const clearDatabase = async () => {
  await db.delete(cars);
};
```

## Best Practices

1. **Isolate tests** - Each test should be independent
2. **Test error cases** - Test both happy and error paths
3. **Use mocks** - Mock external dependencies
4. **Clean up** - Reset state in afterEach
5. **Descriptive names** - Clear test descriptions
6. **Coverage goals** - Aim for 80%+ coverage

## Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      thresholds: { lines: 80, functions: 80, branches: 80 },
    },
  },
});
```

## References

- Vitest: https://vitest.dev
- Hono Testing: https://hono.dev/docs/guides/testing
