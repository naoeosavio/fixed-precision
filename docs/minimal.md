# Minimal Build

The minimal build is a smaller entry point for applications that only need the core fixed-decimal operations.

```ts
import FixedPrecision, { fixedconfig } from "fixed-precision/minimal";

fixedconfig.configure({ places: 8, roundingMode: 4 });

const value = new FixedPrecision("499.99999999999994");

value.toFixed(4); // "500.0000"
value.scale(4).toString(); // "500.0000"
```

## When to Use

Use `fixed-precision/minimal` when bundle size matters and your code only needs the common decimal workflow:

- construction from `string`, `number`, `bigint`, or another FixedPrecision value
- precision factories with `FixedPrecision.create({ places, roundingMode })`
- arithmetic: `add`, `sub`, `mul`, `div`, `idiv`, `mod`, `pow`, `sqrt`
- raw operations: `plus`, `minus`, `product`, `fraction`, `leftover`
- comparisons and sign checks: `cmp`, `eq`, `gt`, `gte`, `lt`, `lte`, `isInteger`, `isNegative`, `isPositive`, `isZero`
- rounding and scale changes: `round`, `scale`, `prec`, `trunc`, `ceil`, `floor`, `shiftedBy`
- aggregate helpers: `random`, `min`, `max`, `sum`
- conversion and formatting: `toString`, `toNumber`, `toFixed`, `toExponential`, `toPrecision`, `toFormat`, `toJSON`, `valueOf`

Use the main `fixed-precision` entry point when you need extended APIs such as logarithms, exponentials, trigonometry, matrix/vector operations, bitwise operations, combinatorics, or fraction helpers.

## Import Paths

```ts
import FixedPrecision from "fixed-precision";
import MinimalPrecision from "fixed-precision/minimal";
```

Both entry points use the same value model: `string` and `number` inputs are decimal values, while `bigint` inputs are treated as already scaled raw values.
