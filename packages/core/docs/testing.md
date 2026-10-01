# Testing Guide

Strategies and examples for testing code that uses FixedPrecision.

## Setup

### Vitest

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
  },
});
```

### Jest

```ts
// jest.config.ts
export default {
  testEnvironment: "node", // or "jsdom" (BigInt supported in jsdom ≥16)
};
```

No mocks or transforms are needed — FixedPrecision uses standard BigInt.

## Basic Matcher Patterns

### Testing exact string output

```ts
import { describe, it, expect } from "vitest";
import FixedPrecision from "fixed-precision";

it("adds two values", () => {
  const result = new FixedPrecision("1.50").add("2.50");
  expect(result.toString()).toBe("4.00000000");
});
```

### Testing numeric conversion

```ts
it("converts to number", () => {
  const value = new FixedPrecision("123.456789");
  expect(value.toNumber()).toBeCloseTo(123.456789, 6);
});
```

### Testing equality

```ts
it("compares values", () => {
  const a = new FixedPrecision("10.00");
  const b = new FixedPrecision("10.00");
  expect(a.eq(b)).toBe(true);
  expect(a.gt(b)).toBe(false);
});
```

### Testing rounding

```ts
it("rounds correctly", () => {
  const value = new FixedPrecision("123.45678900");
  expect(value.round(2).toString()).toBe("123.46");
  expect(value.round(4, 1).toString()).toBe("123.4567"); // ROUND_DOWN
});
```

## Factory Patterns

### Testing with factories

```ts
const FP2 = FixedPrecision.create({ places: 2 });

it("works with factory", () => {
  const price = FP2("19.99");
  const total = price.mul("3");
  expect(total.toString()).toBe("59.97");
});
```

### Testing precision isolation

```ts
it("throws on different precisions", () => {
  const FP2 = FixedPrecision.create({ places: 2 });
  const FP4 = FixedPrecision.create({ places: 4 });

  const a = FP2("10.50");
  const b = FP4("10.5000");

  expect(() => a.add(b)).toThrow("Cannot operate on different precisions");
});
```

## Testing Error Cases

### Division by zero

```ts
it("throws on division by zero", () => {
  const a = new FixedPrecision("10.00");
  expect(() => a.div(0)).toThrow("Division by zero");
});
```

### Invalid input

```ts
it("throws on invalid number", () => {
  expect(() => new FixedPrecision(NaN)).toThrow();
  expect(() => new FixedPrecision(Infinity)).toThrow();
});
```

### Invalid configuration

```ts
it("throws on invalid places", () => {
  expect(() => FixedPrecision.create({ places: -1 })).toThrow();
  expect(() => FixedPrecision.create({ places: 21 })).toThrow();
});

it("throws on invalid rounding mode", () => {
  expect(() => FixedPrecision.create({ places: 2, roundingMode: 9 })).toThrow();
});
```

### Domain errors

```ts
it("throws on sqrt of negative", () => {
  expect(() => new FixedPrecision("-1").sqrt()).toThrow();
});

it("throws on log of zero", () => {
  expect(() => new FixedPrecision("0").ln()).toThrow();
});

it("throws on factorial of negative", () => {
  expect(() => FixedPrecision.factorial(-1)).toThrow();
});
```

## Property-Based Testing

### Roundtrip property: string → FixedPrecision → string

```ts
it("string roundtrip is identity", () => {
  const inputs = ["0", "123.45", "-99.99", "0.001", "1000000"];
  for (const s of inputs) {
    expect(new FixedPrecision(s).toString()).toBe(s + "00000000".slice(s.split(".")[1]?.length ?? 0));
  }
});
```

### Roundtrip property: number → FixedPrecision → number

```ts
it("number roundtrip is approximate", () => {
  const inputs = [0, 1, 123.45, -99.99, 0.001, 1e6];
  for (const n of inputs) {
    const result = new FixedPrecision(n).toNumber();
    expect(result).toBeCloseTo(n, 6);
  }
});
```

### Commutative property: addition

```ts
it("addition is commutative", () => {
  const a = new FixedPrecision("5.25");
  const b = new FixedPrecision("3.75");
  expect(a.add(b).toString()).toBe(b.add(a).toString());
});
```

### Associative property: addition

```ts
it("addition is associative", () => {
  const a = new FixedPrecision("1.5");
  const b = new FixedPrecision("2.5");
  const c = new FixedPrecision("3.5");
  expect(a.add(b.add(c)).toString()).toBe(a.add(b).add(c).toString());
});
```

### Distributive property

```ts
it("multiplication distributes over addition", () => {
  const a = new FixedPrecision("2");
  const b = new FixedPrecision("3");
  const c = new FixedPrecision("4");
  const lhs = a.mul(b.add(c));
  const rhs = a.mul(b).add(a.mul(c));
  expect(lhs.toString()).toBe(rhs.toString());
});
```

## Snapshot Testing

### Vitest inline snapshots

```ts
it("produces expected output", () => {
  const value = new FixedPrecision("123.45678900");
  expect(value.round(2).toString()).toMatchInlineSnapshot('"123.46"');
  expect(value.scale(4).toString()).toMatchInlineSnapshot('"123.4568"');
});
```

### File snapshots

```ts
it("complex calculation", () => {
  const result = new FixedPrecision("100.00")
    .add(50)
    .sub("25")
    .mul(2)
    .div(5);
  expect(result.toString()).toMatchSnapshot();
});
```

## Testing with Randomized Values

```ts
it("addition is consistent with random values", () => {
  const FP = FixedPrecision.create({ places: 4 });
  for (let i = 0; i < 100; i++) {
    const a = Math.random() * 1000;
    const b = Math.random() * 1000;
    const expected = (a + b).toFixed(4);
    const result = FP(a.toString()).add(b.toString());
    expect(result.toFixed(4)).toBe(expected);
  }
});
```

## Testing Static Methods

```ts
it("FixedPrecision.min works", () => {
  expect(FixedPrecision.min("5", "3", "7").toString()).toBe("3.00000000");
});

it("FixedPrecision.max works", () => {
  expect(FixedPrecision.max("5", "3", "7").toString()).toBe("7.00000000");
});

it("FixedPrecision.sum works", () => {
  expect(FixedPrecision.sum(1, 2, 3).toString()).toBe("6.00000000");
});

it("FixedPrecision.abs works", () => {
  expect(FixedPrecision.abs("-50.00").toString()).toBe("50.00000000");
});
```

## Testing Serialization

```ts
it("toJSON for JSON.stringify", () => {
  const data = { total: new FixedPrecision("199.99") };
  expect(JSON.stringify(data)).toBe('{"total":"199.99000000"}');
});

it("roundtrip through JSON", () => {
  const original = new FixedPrecision("99.99");
  const json = JSON.stringify(original);
  const parsed = new FixedPrecision(JSON.parse(json));
  expect(parsed.toString()).toBe(original.toString());
});
```

## Testing with Global Configuration

```ts
beforeEach(() => {
  FixedPrecision.configure({ places: 4, roundingMode: 4 });
});

afterEach(() => {
  FixedPrecision.configure({ places: 8, roundingMode: 4 }); // Reset to defaults
});

it("uses global config", () => {
  const value = new FixedPrecision("1.23456789");
  expect(value.toString()).toBe("1.2346"); // 4 places
});
```

## Testing with Mock Factories

```ts
function createTestFactory(places = 2) {
  return FixedPrecision.create({ places });
}

it("creates consistent factories", () => {
  const FP = createTestFactory();
  const a = FP("10.00");
  const b = FP("5.00");
  expect(a.add(b).toString()).toBe("15.00");
});
```

## Continuous Integration

```bash
# package.json scripts
{
  "test": "vitest run",
  "ci": "npm run lint && npm run check:format && npm run test && npm run build"
}
```

## Next Steps

- [Error Handling](errors.md) — common errors reference
- [Migration Guide](migration.md) — testing after migrating from another library
- [API Reference](api-reference.md) — complete method documentation
