# FixedPrecision

FixedPrecision is a library for handling fixed‑precision decimal numbers in JavaScript/TypeScript. By storing scaled `bigint` values internally, this library enables precise arithmetic, detailed control over decimal places, and various rounding modes — ideal for avoiding floating‑point imprecision.

## Features

- **Configurable precision** — 0 to 20 decimal places.
- **9 rounding modes** — ROUND_UP, ROUND_DOWN, ROUND_CEIL, ROUND_FLOOR, ROUND_HALF_UP, ROUND_HALF_DOWN, ROUND_HALF_EVEN, ROUND_HALF_CEIL, ROUND_HALF_FLOOR.
- **Full arithmetic** — addition, subtraction, multiplication, division, modulo, exponentiation, square root, cube root, negation, integer division.
- **Method chaining** — arithmetic and comparison directly with `number`, `string`, or `bigint` without explicit instantiation.
- **Flexible conversions** — `toString`, `toNumber`, `toFixed`, `toExponential`, `toPrecision`, `toFormat`, `toJSON`, `toBinary`, `toOctal`, `toHex`.
- **Rounding & scaling** — `round`, `prec`, `ceil`, `floor`, `trunc`, `scale`, `shiftedBy`, `clamp`, `toNearest`.
- **Comparisons** — `cmp`, `eq`, `gt`, `gte`, `lt`, `lte` (plus raw variants).
- **Predicates** — `isZero`, `isPositive`, `isNegative`, `isInteger`; logical operations (`sign`, `not`, `and`, `or`, `xor`).
- **Logarithms** — `ln`, `log`, `log2`, `log10`, `exp`.
- **Trigonometry** — `sin`, `cos`, `tan`, `sec`, `csc`, `cot` and their inverse, hyperbolic, and inverse‑hyperbolic counterparts (26 functions total, including `atan2`).
- **Statistics** — `min`, `max`, `sum`, `hypot`, `random`.
- **Math constants** — `PI`, `e`, `phi`, `sqrt2`.
- **Combinatorics** — `factorial`, `permutations`, `combinations`.
- **Vector / matrix** — `dot`, `cross`.
- **Fractions** — `num`, `den`, `fraction`.
- **Bitwise operations** — `bitAnd`, `bitOr`, `bitXor`, `bitNot`, `leftShift`, `rightArithShift`.
- **TypeScript** — full type definitions included (`FixedPrecisionValue`, `FixedPrecisionConfig`, `RoundingMode`, `Comparison`).

## Installation

```bash
npm install fixed-precision
```

## Quick Start

```ts
import FixedPrecision, { fixedconfig } from "fixed-precision";

fixedconfig.configure({ places: 8, roundingMode: 4 });

const a = new FixedPrecision("1.2345");
const b = new FixedPrecision(2.3456);

const sum = a.add(b);
console.log(sum.toString()); // "3.5801"

const product = a.mul(b);
console.log(product.toString()); // "2.8955832"

// Method chaining with raw values
const result = new FixedPrecision(10.5).add(5).div(3).toNumber();
console.log(result); // 5.16666667

// Mixed input types
new FixedPrecision(100).add("50").sub(25n).mul(2).div("5").toString(); // "50"
```

## Global Configuration

Set default decimal places and rounding mode for all `new FixedPrecision()` instances that don't receive an explicit context.

```ts
import { fixedconfig } from "fixed-precision";
// or: FixedPrecision.configure({ ... })

fixedconfig.configure({
  places: 8,        // 0–20
  roundingMode: 4,  // ROUND_HALF_UP (default)
});
```

### Rounding Modes

| Code | Name             | Behavior                                   |
|------|------------------|--------------------------------------------|
| 0    | ROUND_UP         | Rounds away from zero                      |
| 1    | ROUND_DOWN       | Rounds toward zero (truncation)            |
| 2    | ROUND_CEIL       | Rounds toward +Infinity                    |
| 3    | ROUND_FLOOR      | Rounds toward -Infinity                    |
| 4    | ROUND_HALF_UP    | Rounds half away from zero                 |
| 5    | ROUND_HALF_DOWN  | Rounds half toward zero                    |
| 6    | ROUND_HALF_EVEN  | Rounds half to the nearest even number     |
| 7    | ROUND_HALF_CEIL  | Rounds half toward +Infinity               |
| 8    | ROUND_HALF_FLOOR | Rounds half toward -Infinity               |

## Precision Factories (Recommended)

For applications that need multiple precisions at the same time, use immutable factories instead of mutating the global configuration.

```ts
import FixedPrecision, { fixedconfig } from "fixed-precision";

// Independent, immutable contexts
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP2 = FixedPrecision.create({ places: 2 });

const a = FP8("1.23456789"); // "1.23456789"
const b = FP2("1.23");       // "1.23"

// Method chaining works with factories too
const c = FP8(10.5).add(5).div(3);

// Factories are unaffected by global config changes
fixedconfig.configure({ places: 4 });
FP8("1").toString(false);                // "1.00000000" (unchanged)
FP2("1").toString(false);                // "1.00"       (unchanged)
new FixedPrecision("1").toString(false); // "1.0000"  (global default)
```

### Why factories?

- **Performance** — No per‑instance option parsing; the factory captures its scale and rounding mode once.
- **Clarity** — The precision is explicit in the factory variable name.
- **Safety** — No shared mutable state; cross‑context arithmetic throws an error.
- **Flexibility** — Create as many contexts as needed and pass them around.

### Factory API

```ts
FixedPrecision.create(config: FixedPrecisionConfig): (val: FixedPrecisionValue) => FixedPrecision
```

- `config.places` — integer 0–20 (required).
- `config.roundingMode` — integer 0–8 (optional, defaults to 4 / ROUND_HALF_UP).
- The returned function creates instances locked to that configuration.
- `factory.format` exposes the frozen `{ places, roundingMode }` object.

## Documentation

For more detailed guides and examples, see the [docs/](docs/) directory:

| Category | Topics |
|----------|--------|
| **Getting Started** | [Quick Start](docs/quick-start.md), [Installation](docs/installation.md), [Basic Concepts](docs/concepts.md) |
| **Core Features** | [Arithmetic](docs/arithmetic.md), [Raw Operations](docs/raw-operations.md), [Rounding & Scaling](docs/rounding-scaling.md), [Conversion](docs/conversion.md), [Minimal Build](docs/minimal.md) |
| **Configuration** | [Global Configuration](docs/configuration.md), [Precision Factories](docs/factories.md) |
| **Advanced** | [Performance](docs/performance.md), [Error Handling](docs/errors.md), [BigInt Warning](docs/bigint-warning.md) |
| **API** | [Full API Reference](docs/api-reference.md), [Type Definitions](docs/types.md) |
| **Integration** | [Migration Guide](docs/migration.md), [Integration](docs/integration.md), [Testing](docs/testing.md) |

## API Reference

### Constructor

```ts
new FixedPrecision(value: FixedPrecisionValue, ctx?: FPContext)
```

Accepts `string | number | bigint | FixedPrecision`.

- `string` / `number` → parsed as a decimal value and scaled to the current context.
- `bigint` → treated as **already scaled** (pre‑scaled). See [BigInt Warning](#bigint-warning).
- `FixedPrecision` → reused directly (validation ensures same precision context).

### Arithmetic

All arithmetic methods accept `FixedPrecisionValue` (`string | number | bigint | FixedPrecision`).

**Scaled operations** (maintain decimal precision, validate configuration):

| Instance    | Static                      | Description              |
|-------------|-----------------------------|--------------------------|
| `add(v)`    | `FixedPrecision.add(a, b)`  | Addition                 |
| `sub(v)`    | `FixedPrecision.sub(a, b)`  | Subtraction              |
| `mul(v)`    | `FixedPrecision.mul(a, b)`  | Multiplication           |
| `div(v)`    | `FixedPrecision.div(a, b)`  | Division                 |
| `mod(v)`    | `FixedPrecision.mod(a, b)`  | Modulo                   |
| `pow(n)`    | `FixedPrecision.pow(v, n)`  | Exponentiation (integer) |
| `sqrt()`    | `FixedPrecision.sqrt(v)`    | Square root              |
| `square()`  | `FixedPrecision.square(v)`  | Square (value²)          |
| `cube()`    | `FixedPrecision.cube(v)`    | Cube (value³)            |
| `cbrt()`    | `FixedPrecision.cbrt(v)`    | Cube root                |
| `neg()`     | —                           | Negation (-value)        |
| `abs()`     | `FixedPrecision.abs(v)`     | Absolute value           |
| `idiv(v)`     | —                           | Integer division         |
| `divmod(v)`   | —                           | Division → `{ quotient, remainder }` |
| `idivmod(v)`  | —                           | Integer division → `{ quotient, remainder }` |

**Raw operations** (operate directly on scaled values, no configuration validation):

| Instance   | Description (raw)          |
|------------|----------------------------|
| `plus(v)`  | Addition without scaling   |
| `minus(v)` | Subtraction without scaling|
| `times(v)` | Multiplication without scaling |
| `ratio(v)` | Division without scaling   |
| `rem(v)`   | Remainder without scaling  |

### Comparison

**Regular comparisons** (validate configuration):

| Instance  | Static                         | Returns       |
|-----------|--------------------------------|---------------|
| `cmp(v)`  | —                              | `-1 \| 0 \| 1`|
| `eq(v)`   | —                              | `boolean`     |
| `gt(v)`   | —                              | `boolean`     |
| `gte(v)`  | —                              | `boolean`     |
| `lt(v)`   | —                              | `boolean`     |
| `lte(v)`  | —                              | `boolean`     |

**Raw comparisons** (compare scaled values directly, no validation — main build only):

`cmpRaw(v)`, `eqRaw(v)`, `gtRaw(v)`, `gteRaw(v)`, `ltRaw(v)`, `lteRaw(v)`.

### Rounding & Scaling

| Method                              | Description                                         |
|-------------------------------------|-----------------------------------------------------|
| `round(dp?, rm?)`                   | Round to `dp` decimal places                        |
| `prec(sd, rm?)`                     | Round to `sd` significant digits                    |
| `ceil()`                            | Round up to integer                                 |
| `floor()`                           | Round down to integer                               |
| `trunc()`                           | Truncate toward zero                                |
| `scale(newScale, rm?)`              | Rescale to `newScale` decimal places                |
| `shiftedBy(n)`                      | Shift decimal point by `n` places                   |
| `clamp(min, max)`                   | Clamp value between `min` and `max` (main only)     |
| `toNearest(increment, rm?)`         | Round to nearest multiple of `increment` (main only)|

### Formatting & Conversion

| Method                                | Description                                      |
|---------------------------------------|--------------------------------------------------|
| `toString()`                          | Decimal string representation                    |
| `toNumber(places?)`                   | Convert to `number`                              |
| `toFixed(places?, rm?)`               | Fixed‑point notation string                      |
| `toExponential(dp?, rm?)`             | Scientific notation string                       |
| `toPrecision(sd, rm?)`                | Format to significant digits                     |
| `toFormat(dp?, rm?)`                  | String with thousands separators (minimal build) |
| `toJSON()`                            | JSON serialization (same as `toString()`)        |
| `valueOf()`                           | Returns `toString()`                             |
| `toBinary(sd?, rm?)`                  | Binary string (main only)                        |
| `toOctal(sd?, rm?)`                   | Octal string (main only)                         |
| `toHex(sd?, rm?)` / `toHexadecimal()` | Hex string (main only)                           |

### Predicates & Inspection

| Method                    | Description                                  |
|---------------------------|----------------------------------------------|
| `isZero()`                | `true` if value is exactly zero              |
| `isPositive()`            | `true` if value > 0                          |
| `isNegative()`            | `true` if value < 0                          |
| `isInteger()`             | `true` if value has no fractional part       |
| `sign()`                  | Returns `-1`, `0`, `1`, or `NaN` (main only) |
| `not()`                   | Logical NOT — `true` if zero (main only)      |
| `and(v)`, `or(v)`, `xor(v)` | Logical AND / OR / XOR (main only)        |
| `places()` / `decimalPlaces()` | Returns context decimal places (main only) |
| `precision(z?)` / `sd(z?)` | Returns significant digits (main only)      |
| `raw()`                   | Returns the internal `bigint` (main only)     |
| `typeof()`                | Returns `"FixedPrecision"` (main only)        |

### Logarithms (main build only)

| Instance    | Static                       | Description               |
|-------------|------------------------------|---------------------------|
| `ln()`      | `FixedPrecision.ln(v)`       | Natural logarithm         |
| `log(b?)`   | `FixedPrecision.log(v, b?)`  | Logarithm (base optional) |
| `log2()`    | `FixedPrecision.log2(v)`     | Base‑2 logarithm          |
| `log10()`   | `FixedPrecision.log10(v)`    | Base‑10 logarithm         |
| `exp()`     | `FixedPrecision.exp(v)`      | e raised to the value     |

### Trigonometry (main build only)

**Standard:** `sin()`, `cos()`, `tan()`  
**Reciprocal:** `sec()`, `csc()`, `cot()`  
**Inverse:** `asin()`, `acos()`, `atan()`, `atan2(x)`  
**Inverse reciprocal:** `acot()`, `asec()`, `acsc()`  
**Hyperbolic:** `sinh()`, `cosh()`, `tanh()`  
**Reciprocal hyperbolic:** `sech()`, `csch()`, `coth()`  
**Inverse hyperbolic:** `asinh()`, `acosh()`, `atanh()`  
**Inverse reciprocal hyperbolic:** `asech()`, `acsch()`, `acoth()`

All are available as both instance (`value.sin()`) and static (`FixedPrecision.sin(value)`) methods.

### Statistics

| Static method                               | Description                       |
|---------------------------------------------|-----------------------------------|
| `FixedPrecision.min(...vals)`               | Minimum value (array or rest)     |
| `FixedPrecision.max(...vals)`               | Maximum value (array or rest)     |
| `FixedPrecision.sum(...vals)`               | Sum of values (array or rest)     |
| `FixedPrecision.hypot(...vals)`             | Hypotenuse — sqrt(sum of squares) |
| `FixedPrecision.random(decimalPlaces?)`     | Random value 0–1 at given places  |

### Constants (main build only)

| Static method            | Value                              |
|--------------------------|------------------------------------|
| `FixedPrecision.PI()`    | π (pi)                             |
| `FixedPrecision.e()`     | Euler's number                     |
| `FixedPrecision.phi()`   | Golden ratio `(1+√5)/2`            |
| `FixedPrecision.sqrt2()` | √2                                 |

### Combinatorics (main build only)

`FixedPrecision.factorial(n)`, `FixedPrecision.permutations(n, k)`, `FixedPrecision.combinations(n, k)`.

### Fraction (main build only)

| Instance        | Description                                     |
|-----------------|-------------------------------------------------|
| `.num()`        | Numerator of the reduced fraction               |
| `.den()`        | Denominator of the reduced fraction             |
| `.fraction(maxDen?)` | Best rational approximation `[num, den]`  |

### Bitwise Operations (main build only)

`bitAnd(v)`, `bitOr(v)`, `bitXor(v)`, `bitNot()`, `leftShift(n)`, `rightArithShift(n)` — operate directly on the raw scaled `bigint`.

### Vector Operations (main build only)

`FixedPrecision.dot(a, b)` → scalar dot product.  
`FixedPrecision.cross(a, b)` → returns an array (cross product).

## Method Chaining with Raw Values

All arithmetic and comparison methods accept `FixedPrecisionValue` (`string | number | bigint | FixedPrecision`), enabling concise chaining without explicit instantiation:

```ts
new FixedPrecision(100).add("50").sub(25n).mul(2).div("5");       // "50"
new FixedPrecision(10.5).add(5).div(3).gt(5);                     // true
new FixedPrecision("1.23").plus("2.00").times("3.00");           // raw chain
```

**Type behavior:**
- `string` / `number` → decimal values, automatically scaled.
- `bigint` → treated as already scaled (pre‑scaled). See below.
- `FixedPrecision` → requires matching precision context (for scaled operations).

## BigInt Warning

> **critical: `bigint` values are treated as pre‑scaled, not as decimal values.**

```ts
new FixedPrecision("1.23");    // value = 123000000 (assuming 8 decimal places)
new FixedPrecision(1.23);      // value = 123000000
new FixedPrecision(123000000n); // value = 123000000 (pre‑scaled)
new FixedPrecision(123n);      // value = 123 (0.00000123 — NOT 123.00!)
```

When chaining:

```ts
const a = new FixedPrecision("1.23");

a.add(2);            // adds 2.00000000   (number → scaled)
a.add(2n);           // adds 0.00000002   (bigint → pre‑scaled!)
a.add("2.00");       // adds 2.00000000   (string → scaled)
a.add(200000000n);   // adds 2.00000000   (bigint → pre‑scaled correctly)
```

**Use `bigint` only** when you have pre‑calculated scaled values. For literal decimal values, use `number` or `string`.

## Minimal Build

Import a smaller entry point when you only need core decimal operations:

```ts
import FixedPrecision, { fixedconfig } from "fixed-precision/minimal";
```

The minimal build includes: creation, arithmetic, comparison, rounding/scaling, `sqrt`, `random`/`min`/`max`/`sum`, predicates, and common formatting/conversion. It omits the larger extended APIs: trigonometry, logarithms, matrix/vector, bitwise, combinatorics, fractions, constants, logical operations, raw comparisons, and advanced inspection methods.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.
