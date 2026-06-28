# Type Definitions

FixedPrecision is written in TypeScript and ships full type declarations.

## Core Types

### `FixedPrecisionValue`

Union type accepted by all arithmetic, comparison, and conversion methods.

```ts
type FixedPrecisionValue = string | number | bigint | FixedPrecision;
```

| Variant | Example | Notes |
|---------|---------|-------|
| `string` | `"123.45"` | Exact decimal representation |
| `number` | `123.45` | May carry FP imprecision |
| `bigint` | `12345000000n` | Pre-scaled value (`× 10^places`) |
| `FixedPrecision` | instance | Copies the reference internally |

### `RoundingMode`

```ts
type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
```

| Value | Name | Behavior |
|-------|------|----------|
| `0` | `ROUND_UP` | Away from zero |
| `1` | `ROUND_DOWN` | Toward zero (truncation) |
| `2` | `ROUND_CEIL` | Toward +∞ |
| `3` | `ROUND_FLOOR` | Toward −∞ |
| `4` | `ROUND_HALF_UP` | Half away from zero *(default)* |
| `5` | `ROUND_HALF_DOWN` | Half toward zero |
| `6` | `ROUND_HALF_EVEN` | Half to nearest even |
| `7` | `ROUND_HALF_CEIL` | Half toward +∞ |
| `8` | `ROUND_HALF_FLOOR` | Half toward −∞ |

### `Comparison`

```ts
type Comparison = -1 | 0 | 1;
```

Returned by `cmp()` and `cmpRaw()`:

| Value | Meaning |
|-------|---------|
| `-1` | This < other |
| `0`  | This = other |
| `1`  | This > other |

### `FPContext`

```ts
type FPContext = {
  places: number;
  roundingMode: RoundingMode;
  SCALE: bigint;
  SCALENUMBER: number;
};
```

Internal precision context attached to every instance. Not meant to be created or modified directly.

### `FixedPrecisionConfig`

```ts
interface FixedPrecisionConfig {
  places: number;
  roundingMode?: RoundingMode;
}
```

Used with `FixedPrecision.create()` and `FixedPrecision.configure()`.

## Type Safety

### Strict mode required

The library relies on TypeScript strict mode:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Key strict checks that protect against misuse:
- **`strictNullChecks`** — prevents passing `null` or `undefined` as values
- **`noImplicitAny`** — ensures type inference catches invalid inputs
- **`strictFunctionTypes`** — correct variance for factory functions

### `places` as a discriminant

Each factory creates values locked to a specific `places`. While there is no nominal type per factory at runtime, the `places()` method lets you distinguish them programmatically:

```ts
const Price = FixedPrecision.create({ places: 2 });
const Rate = FixedPrecision.create({ places: 6 });

const p = Price("10.50");
const r = Rate("1.500000");

p.places(); // 2
r.places(); // 6

// TypeScript cannot catch this at compile time, but runtime throws:
p.add(r); // Error: Cannot operate on different precisions
```

## Importing Types

```ts
import type {
  FixedPrecisionValue,
  RoundingMode,
  Comparison,
  FixedPrecisionConfig,
} from "fixed-precision";
```

From the minimal entry point:

```ts
import type {
  FixedPrecisionValue,
  RoundingMode,
  Comparison,
} from "fixed-precision/minimal";
```

(Note: `FixedPrecisionConfig` is only exported from the full build.)

## `typeof()` Guard

The `typeof()` method returns the literal `"FixedPrecision"` for runtime type discrimination:

```ts
function process(value: unknown) {
  if (value instanceof FixedPrecision || value?.typeof?.() === "FixedPrecision") {
    // safe to cast
  }
}
```

## Declaration files location

Published types are at:

| Entry point | Declaration |
|-------------|-------------|
| Full (ESM) | `dist/FixedPrecision.d.ts` |
| Full (CJS) | `dist/FixedPrecision.d.cts` |
| Minimal (ESM) | `dist/Minimal.d.ts` |
| Minimal (CJS) | `dist/Minimal.d.cts` |

TypeScript resolves these automatically via the `exports` field in `package.json`.

## Next Steps

- [Configuration](configuration.md) — global and per-instance config
- [API Reference](api-reference.md) — complete method signatures
- [Minimal Build](minimal.md) — smaller type surface
