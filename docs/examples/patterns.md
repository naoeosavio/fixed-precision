# Common Patterns

Reusable patterns and idioms for working with FixedPrecision in real-world applications.

## Value Construction Patterns

### Creating from user input

```ts
function parseValue(input: string): FixedPrecision {
  const trimmed = input.trim();
  if (!/^-?\d+(\.\d+)?$/.test(trimmed)) {
    throw new Error("Invalid number format");
  }
  return new FixedPrecision(trimmed);
}
```

### Creating with fallback

```ts
function safeValue(input: string, fallback = "0"): FixedPrecision {
  try {
    return new FixedPrecision(input);
  } catch {
    return new FixedPrecision(fallback);
  }
}
```

### Guarding against BigInt confusion

```ts
// BigInt values are pre-scaled — document this intent
const MILLION = 1000000n;

// Prefer converting from a string or number when the intent is "1,000,000"
const a = new FixedPrecision("1000000");     // 1,000,000.00000000
const b = new FixedPrecision(1000000n);      // 0.01 (pre-scaled at 8 places!)
```

## Factory Patterns

### One factory per domain concept

```ts
const Price = FixedPrecision.create({ places: 2 });
const Quantity = FixedPrecision.create({ places: 0 });
const TaxRate = FixedPrecision.create({ places: 4 });
const ExchangeRate = FixedPrecision.create({ places: 6 });

const price = Price("19.99");
const qty = Quantity("3");
const taxRate = TaxRate("0.0875");
```

### Re-exporting factories

```ts
// precision.ts
import FixedPrecision from "fixed-precision";

export const Money = FixedPrecision.create({ places: 2, roundingMode: 4 });
export const Stats = FixedPrecision.create({ places: 6, roundingMode: 6 });
export const Sci = FixedPrecision.create({ places: 12, roundingMode: 4 });

// elsewhere.ts
import { Money, Stats } from "./precision";

const total = Money("100").add("50");
const average = Stats("10.5").add("20.3");
```

## Cross-Precision Patterns

### Converting between factories via string

```ts
const Price = FixedPrecision.create({ places: 2 });
const Rate = FixedPrecision.create({ places: 6 });

const price = Price("19.99");
const rate = Rate("1.085432");

// Convert rate to price's precision
const converted = Price(rate.toString());
const total = price.mul(converted);
```

### Factory-agnostic comparison

```ts
function areEqual(a: FixedPrecision, b: FixedPrecision): boolean {
  return a.eq(b.toString());
}
```

### Normalizing to a common precision

```ts
function normalize(values: FixedPrecision[], places: number): FixedPrecision[] {
  const Factory = FixedPrecision.create({ places });
  return values.map(v => Factory(v.toString()));
}
```

## Rounding Patterns

### Round only for display, keep full precision for calculations

```ts
const raw = new FixedPrecision("123.456789");

// Calculations use full precision
const doubled = raw.mul(2); // "246.91357800"

// Round only when presenting to the user
function display(value: FixedPrecision): string {
  return value.round(2).toString();
}

display(doubled); // "246.91"
```

### Consistent rounding mode per module

```ts
// Use a factory to enforce the same rounding mode everywhere
const Pricing = FixedPrecision.create({ places: 2, roundingMode: 0 }); // ROUND_UP

const tax = Pricing("1.234"); // "1.24" (rounded up)
```

### Tiered rounding

```ts
function tieredRound(value: FixedPrecision): FixedPrecision {
  const abs = value.abs();

  if (abs.lt("0.01"))  return value.round(6);
  if (abs.lt("1"))     return value.round(4);
  if (abs.lt("1000"))  return value.round(2);
  return value.round(0);
}
```

## Validation Patterns

### Checking divisibility

```ts
function isDivisibleBy(amount: FixedPrecision, divisor: FixedPrecision): boolean {
  return amount.mod(divisor).isZero();
}

// Is 10.50 divisible by 0.25?
isDivisibleBy(new FixedPrecision("10.50"), new FixedPrecision("0.25")); // true
```

### Validating a value is in whole units

```ts
function isWholeCurrency(value: FixedPrecision): boolean {
  return value.mod("0.01").isZero();
}
```

### Range validation

```ts
function inRange(value: FixedPrecision, min: FixedPrecision, max: FixedPrecision): boolean {
  return value.gte(min) && value.lte(max);
}
```

## Serialization Patterns

### `toJSON` for JSON.stringify

```ts
const data = {
  id: 1,
  total: new FixedPrecision("199.99"),
};

JSON.stringify(data);
// '{"id":1,"total":"199.99000000"}'
```

### Deserializing from API responses

```ts
interface ApiResponse {
  total: string;
  tax: string;
}

function deserializeOrder(data: ApiResponse) {
  return {
    total: new FixedPrecision(data.total),
    tax: new FixedPrecision(data.tax),
  };
}
```

## Performance Patterns

### Reuse coerced values

```ts
// Less efficient: coerce "5.00" on every call
let total1 = new FixedPrecision("0");
for (const price of prices) {
  total1 = total1.add(price).add("5.00"); // string → FixedPrecision each time
}

// More efficient: pre-coerce the constant
const SHIPPING = new FixedPrecision("5.00");
let total2 = new FixedPrecision("0");
for (const price of prices) {
  total2 = total2.add(price).add(SHIPPING); // FixedPrecision instance
}
```

### Batch operations with raw values

When you need to sum many values, work with raw bigints directly:

```ts
function fastSum(values: FixedPrecision[]): FixedPrecision {
  if (values.length === 0) return new FixedPrecision(0);
  const ctx = values[0].ctx;
  let raw = 0n;
  for (const v of values) {
    raw += v.raw();
  }
  const instance = new FixedPrecision(0n, ctx);
  instance.value = raw;
  return instance;
}
```

### Minimal build for bundle size

```ts
// Import only the minimal build when factories, config, and
// static methods are not needed
import { FixedPrecision } from "fixed-precision/minimal";
```

## Error Handling Patterns

### Try-catch wrapper for arithmetic

```ts
function safeDivide(
  a: FixedPrecision,
  b: FixedPrecision,
): { ok: true; value: FixedPrecision } | { ok: false; error: string } {
  try {
    return { ok: true, value: a.div(b) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
```

### Guard factory creation

```ts
function createPrecision(places: number) {
  if (!Number.isInteger(places) || places < 0 || places > 20) {
    throw new Error(`Invalid precision: ${places}. Must be 0-20.`);
  }
  return FixedPrecision.create({ places });
}
```

## Comparison and Sorting Patterns

### Sorting an array

```ts
const values = [
  new FixedPrecision("10.50"),
  new FixedPrecision("5.25"),
  new FixedPrecision("20.00"),
];

values.sort((a, b) => a.cmp(b));
// ["5.25", "10.50", "20.00"]
```

### Custom comparison predicate

```ts
function isApproximatelyEqual(
  a: FixedPrecision,
  b: FixedPrecision,
  tolerance: FixedPrecision = new FixedPrecision("0.0001"),
): boolean {
  return a.sub(b).abs().lte(tolerance);
}
```

## Next Steps

- [Financial Examples](examples/finance.md) — real-world financial calculations
- [Scientific Examples](examples/scientific.md) — scientific and statistical patterns
- [Gaming Examples](examples/gaming.md) — game development patterns
- [Performance Guide](performance.md) — deeper performance optimization
