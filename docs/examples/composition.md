# Composition Examples: standalone vs `pipe` + `bind`

Every functional pipeline can be written with plain standalone calls or
composed through `fixed-precision/pipe`. Both produce **identical values** —
they differ only in ergonomics.

| Style | Import | Best for |
|-------|--------|----------|
| Standalone functions | `fixed-precision/<fn>` | Single operations, smallest bundles |
| `pipe` / `compose` + `bind` | `fixed-precision/pipe` | Pipelines and reusable transforms |

## Checkout Total

Price × quantity − 10% discount + 8% tax, rounded to cents.

### Standalone

```typescript
import { createFactory } from "fixed-precision/createFactory";
import { multiply, round } from "fixed-precision/multiply";
import { toFixed } from "fixed-precision/toFixed";

const Money = createFactory({ places: 2 });
const price = Money("19.99");

const subtotal = multiply(price, "3");                              // 59.97
const discounted = round(multiply(subtotal, "0.90"), { places: 2 }); // 53.97
const total = round(multiply(discounted, "1.08"), { places: 2 });    // 58.28

console.log(toFixed(total, { places: 2 })); // "58.28"
```

### `pipe` + `bind`

```typescript
import { createFactory } from "fixed-precision/createFactory";
import { multiply, round } from "fixed-precision/multiply";
import { toFixed } from "fixed-precision/toFixed";
import { bind, compose, pipe } from "fixed-precision/pipe";

const Money = createFactory({ places: 2 });

const checkout = pipe(
  bind(multiply, "3"),
  bind(multiply, "0.90"),
  bind(multiply, "1.08"),
  bind(round, { places: 2 }),
);

console.log(bind(toFixed, { places: 2 })(checkout(Money("19.99"))));
// "58.28"
```

### Lambdas where they read better

```typescript
import { pipe } from "fixed-precision/pipe";
import type { FixedPrecisionData } from "fixed-precision/pipe/types";

checkout = pipe(
  (v: FixedPrecisionData) => round(multiply(v, "0.90"), { places: 2 }),
  (v: FixedPrecisionData) => round(multiply(v, "1.08"), { places: 2 }),
)(multiply(Money("19.99"), "3"));
```

> **Intermediate precision note:** operations run at the context carried by the
> operands (here `places: 2`), and division/multiplication truncate to that
> scale before your explicit `round`. Both styles behave identically — if you
> need guard digits, build values with more places or `scale` mid-pipeline.

## Reusable Transforms

`bind(fn)` returns a standalone transform — define pricing policies once:

```typescript
import { multiply } from "fixed-precision/multiply";
import { bind, compose, pipe } from "fixed-precision/pipe";

const applyDiscount = bind(multiply, "0.90");
const withTax = bind(multiply, "1.08");
const money = bind(toFixed, { places: 2 });

const gross = pipe(applyDiscount, withTax);
gross(Money("19.99")); // FixedPrecisionData @ places: 2
money(gross(Money("49.99"))); // "48.58"

// compose applies right-to-left: toFixed(round(multiply(v, "2")))
const double = compose(money, cents, bind(multiply, "2"));
double(Money("5")); // "10.00"
```

## Unit Conversion

Celsius → Fahrenheit: `× 1.8 + 32` (default context, no factory needed).

```typescript
import { add } from "fixed-precision/add";
import { multiply } from "fixed-precision/multiply";
import { bind, pipe, stringify } from "fixed-precision/pipe";

stringify(add(multiply("36.6", "1.8"), "32")); // standalone: "97.88"

pipe(
  bind(multiply, "1.8"),
  bind(add, "32"),
  stringify,
)("36.6"); // "97.88"
```

## Aggregations

Average cart value from an array of money values.

```typescript
import { divide } from "fixed-precision/divide";
import { sum } from "fixed-precision/sum";
import { bind, compose, pipe } from "fixed-precision/pipe";
import { toFixed } from "fixed-precision/toFixed";

const items = ["10.00", "5.50", "3.25", "1.25"].map(Money);

const average = pipe(
  (list: FixedPrecisionData[]) => divide(sum(list), list.length),
  bind(toFixed, { places: 2 }),
);

average(items); // "5.00"
```

## Which One Should I Use?

- **One operation, hot path, tiny bundle** → standalone function
  (`fixed-precision/add`).
- **Pipelines and reusable transforms** → `pipe` (or right-to-left
  `compose`) + `bind`; lambdas for the odd shape.

Both interoperate freely: every stage speaks the same plain
`FixedPrecisionData`, and contexts keep flowing through operands regardless of
style.
