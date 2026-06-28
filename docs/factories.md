# Precision Factories

## Why Factories?

When working with fixed-precision arithmetic, you often need many numbers sharing the same precision and rounding mode. Using the default constructor naively introduces three problems:

### 1. Repeated configuration overhead

Every time you create a number, the options must be validated and stored, adding a small overhead:

```ts
// Without factories: config options repeated everywhere
const a = new FixedPrecision("10.50", { places: 2, roundingMode: 4 });
const b = new FixedPrecision("5.25", { places: 2, roundingMode: 4 });
const c = new FixedPrecision("3.00", { places: 2, roundingMode: 4 });
```

### 2. Verbose, error-prone code

Repeating the same options across the codebase makes it more verbose and harder to maintain.

### 3. Risk of inconsistent configurations

Two numbers created close together could accidentally use different rounding modes, leading to subtle bugs that are hard to track down:

```ts
// Accidentally mixing rounding modes
const price = new FixedPrecision("19.99", { places: 2, roundingMode: 4 }); // HALF_UP
const tax = new FixedPrecision("19.99", { places: 2, roundingMode: 1 });   // ROUND_DOWN — bug!
```

## The Global Configuration Alternative

An alternative approach is a global configuration:

```ts
FixedPrecision.configure({ places: 2, roundingMode: 4 });
const a = new FixedPrecision("10.50"); // uses global settings
const b = new FixedPrecision("5.25");  // uses global settings
```

But this introduces **mutable global state**, which can be problematic in larger applications or when you need two different precisions at the same time.

## The Factory Solution

Inspired by libraries like `decimal.js`, FixedPrecision provides a `create()` method that returns a **factory function** with an immutable configuration:

```ts
import FixedPrecision from "fixed-precision";

const Money = FixedPrecision.create({ places: 2, roundingMode: 4 });
const Rate = FixedPrecision.create({ places: 6, roundingMode: 6 }); // HALF_EVEN

const price = Money("19.99");
const taxRate = Rate("0.0875");

const tax = Money(taxRate.mul(price).toString());
```

### How it works

`FixedPrecision.create(config)` validates the configuration once, builds an internal context, and returns a simple function:

```ts
const Money = FixedPrecision.create({ places: 2, roundingMode: 4 });
// Money: (val: FixedPrecisionValue) => FixedPrecision
```

Every number created through the factory inherits the same immutable precision and rounding mode:

```ts
const a = Money("10.50");
const b = Money("5.25");
const c = Money("3.00");

console.log(a.places()); // 2
console.log(b.places()); // 2
console.log(c.places()); // 2

// All compatible — safe to operate between them
console.log(a.add(b).toString()); // "15.75"
```

### Multiple factories in the same app

You can have multiple factories with different precisions side by side without mutable global state:

```ts
// Financial calculations: 2 decimal places, HALF_UP
const Price = FixedPrecision.create({ places: 2, roundingMode: 4 });

// Exchange rates: 6 decimal places, HALF_EVEN (banker's rounding)
const Rate = FixedPrecision.create({ places: 6, roundingMode: 6 });

// Scientific: 12 decimal places
const Sci = FixedPrecision.create({ places: 12, roundingMode: 4 });

const itemPrice = Price("149.99");
const exchangeRate = Rate("1.085432");
const measurement = Sci("0.000000000123");
```

### Incompatibility protection

If you try to operate on numbers from different factories, FixedPrecision throws an error, protecting you from accidental precision mismatches:

```ts
const Price = FixedPrecision.create({ places: 2, roundingMode: 4 });
const Rate = FixedPrecision.create({ places: 6, roundingMode: 6 });

const p = Price("10.00");
const r = Rate("1.500000");

p.add(r); // Error: Cannot operate on different precisions
```

## Factory vs. Global Configuration vs. Constructor

| Approach | Immutable | Multiple precisions | No repetition | Safe |
|---|---|---|---|---|
| Constructor with config | Yes | Yes | No | Partial |
| Global `configure()` | No (mutable) | No | Yes | Partial |
| Factory `create()` | Yes | Yes | Yes | Yes |

## Using Factories with Minimal Build

Factories are also available in the minimal entry point:

```ts
import { FixedPrecision } from "fixed-precision/minimal";

const Money = FixedPrecision.create({ places: 2 });
const price = Money("19.99");
```

## Next Steps

- [Minimal Build](minimal.md) — smaller bundle for core operations
- [Basic Concepts](concepts.md) — understand the internal context model
- [Rounding & Scaling](rounding-scaling.md) — all available rounding modes
