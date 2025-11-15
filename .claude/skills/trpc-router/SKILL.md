---
name: trpc-router
description: Add or modify tRPC routes with type-safe procedures and authentication. Use when creating new API endpoints that need type safety or updating existing tRPC routes.
allowed-tools: Read, Edit, Write, Grep, Glob
---

# tRPC Router Skill

This skill helps you work with tRPC routes in `apps/api/src/trpc/`.

## When to Use This Skill

- Creating new type-safe API endpoints
- Adding authentication/authorization to routes
- Implementing input validation with Zod
- Creating public vs. protected procedures
- Debugging tRPC errors or type issues

## tRPC Architecture

tRPC provides end-to-end type safety between API and client:

```
apps/api/src/trpc/
├── root.ts              # Root router combining all routers
├── trpc.ts              # tRPC context and procedure definitions
└── routers/             # Individual feature routers
    ├── cars.ts
    ├── coe.ts
    └── posts.ts
```

## Key Patterns

### 1. Creating a New Router

```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const myRouter = createTRPCRouter({
  // Public endpoint (no auth required)
  getAll: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input, ctx }) => {
      const { limit, offset } = input;
      // Query database using ctx.db
      return await ctx.db.query.myTable.findMany({
        limit,
        offset,
      });
    }),

  // Protected endpoint (requires authentication)
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // ctx.user is available in protected procedures
      return await ctx.db.insert(myTable).values({
        ...input,
        userId: ctx.user.id,
      });
    }),
});
```

### 2. Input Validation with Zod

Always validate inputs using Zod schemas:

```typescript
import { z } from "zod";

const carInputSchema = z.object({
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive().optional(),
});

export const carsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(carInputSchema)
    .mutation(async ({ input, ctx }) => {
      // Input is fully typed and validated
      return await ctx.db.insert(cars).values(input);
    }),
});
```

### 3. Procedure Types

**Query** - For reading data (GET-like):
```typescript
getById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    // Return data
  })
```

**Mutation** - For writing data (POST/PUT/DELETE-like):
```typescript
update: protectedProcedure
  .input(z.object({ id: z.string(), name: z.string() }))
  .mutation(async ({ input }) => {
    // Modify data
  })
```

**Subscription** - For real-time updates (WebSocket):
```typescript
onUpdate: publicProcedure
  .subscription(() => {
    // Stream updates
  })
```

## Common Tasks

### Adding a New Router

1. Create router file in `apps/api/src/trpc/routers/`
2. Define procedures with input validation
3. Import and add to root router in `apps/api/src/trpc/root.ts`:
   ```typescript
   import { myRouter } from "./routers/my-router";

   export const appRouter = createTRPCRouter({
     cars: carsRouter,
     coe: coeRouter,
     my: myRouter, // Add here
   });
   ```
4. Types are automatically available in client apps

### Adding Authentication

Use `protectedProcedure` for authenticated routes:

```typescript
import { protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  dangerousOperation: protectedProcedure
    .mutation(async ({ ctx }) => {
      // ctx.user is guaranteed to exist
      console.log("User:", ctx.user.email);
      // Perform operation
    }),
});
```

### Error Handling

Throw tRPC errors with appropriate codes:

```typescript
import { TRPCError } from "@trpc/server";

export const carsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const car = await ctx.db.query.cars.findFirst({
        where: eq(cars.id, input.id),
      });

      if (!car) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Car with id ${input.id} not found`,
        });
      }

      return car;
    }),
});
```

Error codes:
- `BAD_REQUEST` - Invalid input
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Not authorized
- `NOT_FOUND` - Resource not found
- `INTERNAL_SERVER_ERROR` - Server error

## Context Access

The `ctx` parameter provides access to:
- `ctx.db` - Drizzle database instance
- `ctx.redis` - Redis client
- `ctx.user` - Current user (in protectedProcedure)
- `ctx.req` - HTTP request object
- `ctx.res` - HTTP response object

## Type Safety

tRPC automatically generates TypeScript types:

```typescript
// In client code (e.g., Next.js app)
import { trpc } from "@/lib/trpc";

// Fully typed, autocomplete works!
const { data, isLoading } = trpc.cars.getAll.useQuery({
  limit: 10,
  offset: 0,
});

// Type error if input is wrong
const { mutate } = trpc.cars.create.useMutation();
mutate({
  make: "Toyota",
  // Error: missing required field 'model'
});
```

## Testing tRPC Routes

Create tests in `apps/api/src/trpc/routers/__tests__/`:

```typescript
import { describe, it, expect } from "vitest";
import { createCaller } from "../../trpc";
import { appRouter } from "../../root";

describe("cars router", () => {
  it("should get all cars", async () => {
    const caller = createCaller(appRouter);
    const result = await caller.cars.getAll({ limit: 10, offset: 0 });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
```

Run tests:
```bash
pnpm -F @sgcarstrends/api test -- src/trpc
```

## References

- tRPC Documentation: Use Context7 to get latest tRPC docs
- Related files:
  - `apps/api/src/trpc/trpc.ts` - Procedure definitions
  - `apps/api/src/trpc/root.ts` - Root router
  - `apps/api/CLAUDE.md` - API service documentation

## Best Practices

1. **Validation**: Always use Zod for input validation
2. **Type Safety**: Let TypeScript infer types, avoid manual typing
3. **Error Handling**: Use appropriate tRPC error codes
4. **Security**: Use `protectedProcedure` for sensitive operations
5. **Naming**: Use clear, RESTful names (get, getById, create, update, delete)
6. **Testing**: Write tests for all procedures
7. **Documentation**: Add JSDoc comments for complex logic
