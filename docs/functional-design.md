# Functional API Design

The functional layer of FixedPrecision (the per-function entry points like
`fixed-precision/add`, `fixed-precision/round`, ...) follows two deliberate
design decisions:

1. **No mutable global context** — the default context is a frozen constant.
2. **`(value, options)` signatures** — modifiers are passed as a named options
   object instead of positional parameters.

This page explains why, and shows the supported ways to control precision.

## Why there is no global context mutation

In the functional API there is **no equivalent to `FixedPrecision.configure()`**.
The built-in fallback context is an immutable constant:

```ts
// Internal implementation (src/FP/construction/value.ts)
const DEFAULT_CONTEXT = Object.freeze(makeContext(8, 4)); // 8 places, HALF_UP
```

Functions never read or write shared module state at call time:

```ts
import { add } from "fixed-precision/add";

add("10.50", "2.25"); // uses the frozen default only when no operand carries a context
```

### Reasons

- **Predictability across modules.** Mutable global settings create hidden
  coupling: one module calling `configure({ places: 2 })` would silently change
  results everywhere else (see the caveats in
  [Configuration](configuration.md)). With a frozen default this failure mode
  cannot happen.
- **Tree-shakeable by construction.** Each function must be self-contained so
  that importing `fixed-precision/round` alone stays small and side-effect free.
  A writable global would force every entry point to share and guard the same
  mutable slot.
- **Isolation for tests and concurrency.** SSR requests, web workers and
  parallel test files each get the same deterministic behavior without
  ordering-sensitive setup or teardown.
- **Precedent.** date-fns removed its global configuration between v1 and v2 in
  favor of explicit arguments; explicit contexts scale better in real codebases.

Note that the functional default is also **independent from the class static
default**: `FixedPrecision.configure()` affects only the class API, and nothing
in the functional API can be reconfigured globally. This separation is
intentional — see the table below.

## How to control precision instead

Every function accepts operands that carry their own context
(`string | number | bigint | FixedPrecisionData`). Instead of mutating a
global, you attach the context to the values themselves.

### 1. Factories (recommended)

`createFactory(config)` returns a closure that builds `FixedPrecisionData`
with a fixed context:

```ts
import { createFactory } from "fixed-precision/createFactory";

const Price = createFactory({ places: 2 });
const Rate = createFactory({ places: 6 });

const total = Price("19.99");   // carries places: 2
const rate = Rate("1.085432");  // carries places: 6
```

### 2. Context flows through operations

Results are plain data that keep their context, and subsequent calls resolve
it automatically (the highest `places` among operands wins):

```ts
import { multiply } from "fixed-precision/multiply";
import { stringify } from "fixed-precision/stringify";

const result = multiply(total, rate); // resolved at places: 6
stringify(result);                    // "21.697785"
```

Literals adapt to the context of the first contextual operand — no setup
required.

### 3. Per-call options

Where a function supports tuning, pass it in the options object (see next
section):

```ts
import { round } from "fixed-precision/round";
import { scale } from "fixed-precision/scale";

round(total, { roundingMode: 1 });      // ROUND_DOWN, keeps places
scale(total, { places: 4 });            // convert to another precision
```

### 4. The class API, when you want a global

If your application genuinely wants application-wide defaults, use the class
entry point, which has its own isolated default:

```ts
import FixedPrecision from "fixed-precision";

FixedPrecision.configure({ places: 4 });
new FixedPrecision("19.99").add("5.25");
```

| Aspect | Functional API | Class API |
|--------|----------------|-----------|
| Global config | None (frozen default) | `FixedPrecision.configure()` |
| Default | 8 places, HALF_UP | 8 places, HALF_UP |
| Config mechanism | Operands + factories + options | Static config / factories / instance ctx |
| Semantics | Lenient (highest `places` wins) | Strict (throws on mixed precisions) |

## Why `(value, options)` signatures

Modifier arguments are passed as a trailing options object rather than
positional parameters:

```ts
// positional (old style)
round("2.567", 2, 1);

// options object (current)
round("2.567", { places: 2, roundingMode: 1 });
```

### Rationale

- **Extensible without breaking changes.** Adding a knob later means adding an
  optional key, not reshuffling positional arguments.
- **Readable call sites.** `{ sd: 3 }` is self-documenting; a bare `3` between
  other numbers is not.
- **Partial overrides fall back naturally.** Omitted keys defer to the resolved
  context (`options?.places ?? ctx.places`), which mirrors how date-fns options
  compose with defaults.
- **Primary operands stay positional.** Only *modifiers* moved into options:
  `toBase(value, base, options?)` and `toNearest(value, increment, options?)`
  keep their main operands as positional arguments because they define *what*
  is operated on, not *how*.

### Options reference

| Function | Signature | Option keys |
|----------|-----------|-------------|
| `round` | `(value, options?)` | `places?`, `roundingMode?` |
| `scale` | `(value, options)` | `places`, `roundingMode?` |
| `toFixed` | `(value, options?)` | `places?`, `roundingMode?` |
| `toExponential` | `(value, options?)` | `places?`, `roundingMode?` |
| `toNumber` | `(value, options?)` | `places?` |
| `random` | `(options?)` | `places?` |
| `toNearest` | `(value, increment, options?)` | `roundingMode?` |
| `toPrecision` | `(value, options)` | `sd`, `roundingMode?` |
| `toBase` | `(value, base, options?)` | `sd?`, `roundingMode?` |
| `log` | `(value, options?)` | `base?` |
| `fraction` | `(value, options?)` | `maxDen?` |

All other functional functions take their operands directly and need no
options.

## Composition: `pipe` and `bind`

The standalone functions are the foundation; `fixed-precision/pipe` builds
composition on top of them without changing their semantics or duplicating
them. It exports exactly three functions:

- **`pipe(...stages)`** — returns a function waiting for the value; stages run
  left-to-right.
- **`compose(...stages)`** — same contract, stages applied right-to-left.
- **`bind(fn, ...args)`** — binds the trailing arguments of a standalone into
  `(value) => fn(value, ...args)`; doubles as a reusable transform.

```ts
const withTax = pipe(bind(add, "2"), bind(multiply, "3"), stringify);
withTax("1"); // "9"
```

Raw lambdas are equally valid stages, so any shape is reachable without extra
API surface:

```ts
pipe(
  (x: string) => add("2", x),
  (data: FixedPrecisionData) => multiply("3", data),
  stringify,
)("1"); // "9"
```

Unary functions plug in directly (`pipe(sqrt, stringify)`), operand contexts
flow through unchanged, and every stage speaks plain `FixedPrecisionData`.

## Next Steps

- [Configuration](configuration.md) — class-level global, factory and instance configuration
- [Factories](factories.md) — deep dive into factory patterns
- [Rounding & Scaling](rounding-scaling.md) — rounding modes reference
