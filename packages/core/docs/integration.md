# Integration Guide

How to integrate FixedPrecision with common frameworks, tools, and environments.

## Module Bundlers

### Webpack / Vite / esbuild / Rollup

FixedPrecision ships as ESM with `"type": "module"` and works with any bundler out of the box:

```ts
import FixedPrecision from "fixed-precision";
```

Tree-shaking works: imports from the minimal entry point only bundle what you use:

```ts
// ~40% smaller bundle
import { FixedPrecision } from "fixed-precision/minimal";
```

### Next.js

```ts
// next.config.mjs — no special config needed
export default {
  // FixedPrecision is fully compatible with server components
};
```

Using in Server Components:

```ts
// app/page.tsx
import FixedPrecision from "fixed-precision";

export default function Page() {
  const price = new FixedPrecision("19.99");
  return <div>Total: {price.toString()}</div>;
}
```

Using in Client Components:

```ts
"use client";
import FixedPrecision from "fixed-precision";
```

### Remix / Astro / SvelteKit / Nuxt

No configuration required. Import and use:

```ts
// Works in all frameworks that support ESM
import FixedPrecision from "fixed-precision";
```

### Electron

```ts
// main process (Node.js)
import FixedPrecision from "fixed-precision";

// renderer process (Chromium)
import FixedPrecision from "fixed-precision";
```

Both processes support BigInt natively.

## Testing Frameworks

### Vitest

```ts
// __tests__/decimal.test.ts
import { describe, it, expect } from "vitest";
import FixedPrecision from "fixed-precision";

describe("FixedPrecision", () => {
  it("adds correctly", () => {
    const result = new FixedPrecision("1.50").add("2.50");
    expect(result.toString()).toBe("4.00000000");
  });
});
```

### Jest

```ts
// FixedPrecision uses BigInt, which requires jsdom ≥16 or node.
// jest.config.js — no special transform needed.
```

### Playwright / Cypress (E2E)

```ts
// FixedPrecision runs in the browser;
// use it inside page.evaluate() or directly in front-end code.
```

## State Management

### Zustand

```ts
import { create } from "zustand";
import FixedPrecision from "fixed-precision";

interface PriceStore {
  price: FixedPrecision;
  setPrice: (v: FixedPrecisionValue) => void;
}

const usePriceStore = create<PriceStore>((set) => ({
  price: new FixedPrecision("0"),
  setPrice: (v) => set({ price: new FixedPrecision(v) }),
}));
```

### Redux Toolkit

```ts
import { createSlice } from "@reduxjs/toolkit";
import FixedPrecision from "fixed-precision";

const cartSlice = createSlice({
  name: "cart",
  initialState: { total: "0.00" },
  reducers: {
    addItem(state, action) {
      const current = new FixedPrecision(state.total);
      state.total = current.add(action.payload).toString();
    },
  },
});

// Store as string in Redux; reconstruct when needed
```

⚠️ Store `FixedPrecision` values as strings in state managers. BigInt and class instances are not serializable.

### Pinia (Vue)

```ts
// store/cart.ts
import { defineStore } from "pinia";
import FixedPrecision from "fixed-precision";

export const useCartStore = defineStore("cart", {
  state: () => ({ total: "0.00" }),
  actions: {
    add(amount: string) {
      this.total = new FixedPrecision(this.total).add(amount).toString();
    },
  },
});
```

## Validation Libraries

### Zod

```ts
import { z } from "zod";
import FixedPrecision from "fixed-precision";

const PriceSchema = z.string().refine(
  (v) => {
    try {
      new FixedPrecision(v);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid decimal value" },
);

// Usage
const result = PriceSchema.parse("19.99"); // string
const price = new FixedPrecision(result);  // FixedPrecision
```

### Yup

```ts
import * as yup from "yup";

const priceSchema = yup
  .string()
  .test("is-decimal", "Invalid decimal", (v) => {
    if (!v) return false;
    try {
      new FixedPrecision(v);
      return true;
    } catch {
      return false;
    }
  });
```

### Joi

```ts
import Joi from "joi";

const schema = Joi.string().custom((value, helpers) => {
  try {
    new FixedPrecision(value);
    return value;
  } catch {
    return helpers.error("any.invalid");
  }
}, "FixedPrecision value");
```

## ORMs and Databases

### Prisma / TypeORM / Drizzle

Store decimal values as strings for portability:

```ts
// schema.prisma
model Product {
  id    Int    @id @default(autoincrement())
  price String // store as "19.99"
}

// application code
const product = await prisma.product.findUnique({ where: { id: 1 } });
const price = new FixedPrecision(product.price);
```

Or use `Decimal` column types where available and convert on read/write:

```ts
// Read from DB
const raw = row.price; // Decimal from driver
const price = new FixedPrecision(raw.toString());

// Write to DB
const price = new FixedPrecision("19.99");
row.price = price.toString();
```

### MongoDB / Firestore / Supabase

```ts
// Store as string
await db.collection("orders").insertOne({
  total: new FixedPrecision("99.99").toString(),
});

// Read and reconstruct
const order = await db.collection("orders").findOne({ _id: id });
const total = new FixedPrecision(order.total);
```

## REST APIs

### Express / Fastify

```ts
// Request — validate and convert
app.post("/orders", (req, res) => {
  const amount = new FixedPrecision(req.body.amount);
  // ...
});

// Response — serialize to string
app.get("/orders/:id", (req, res) => {
  const order = { total: new FixedPrecision("99.99") };
  res.json(order); // toJSON() serializes as string
});
```

### tRPC

```ts
import { z } from "zod";
import { procedure, router } from "./trpc";

export const appRouter = router({
  createOrder: procedure
    .input(z.object({
      amount: z.string().refine(v => !isNaN(Number(v))),
    }))
    .mutation(({ input }) => {
      const amount = new FixedPrecision(input.amount);
      // ...
    }),
});
```

## GraphQL

```ts
// Custom scalar for decimal values
const DecimalScalar = new GraphQLScalarType({
  name: "Decimal",
  serialize(value: FixedPrecision) {
    return value.toString();
  },
  parseValue(value: string) {
    return new FixedPrecision(value);
  },
});
```

## API Clients (axios, fetch)

```ts
// Request interceptor — convert FixedPrecision to string
api.interceptors.request.use((config) => {
  if (config.data?.total instanceof FixedPrecision) {
    config.data.total = config.data.total.toString();
  }
  return config;
});

// Response interceptor — convert string to FixedPrecision
api.interceptors.response.use((response) => {
  if (response.data?.total) {
    response.data.total = new FixedPrecision(response.data.total);
  }
  return response;
});
```

## Environment Detection

```ts
function isBigIntSupported(): boolean {
  try {
    BigInt(1);
    return true;
  } catch {
    return false;
  }
}

if (!isBigIntSupported()) {
  throw new Error("FixedPrecision requires BigInt support");
}
```

## Next Steps

- [Quick Start](quick-start.md) — basic usage
- [Testing Guide](testing.md) — testing strategies and examples
- [API Reference](api-reference.md) — complete method documentation
