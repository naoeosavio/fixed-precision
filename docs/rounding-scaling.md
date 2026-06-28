# Rounding & Scaling

FixedPrecision provides fine-grained control over rounding and decimal place adjustment. All rounding/scaling methods return a new instance — the original is never mutated.

## Rounding Modes

| Mode | Name | Behavior |
|------|------|----------|
| `0` | `ROUND_UP` | Away from zero |
| `1` | `ROUND_DOWN` | Toward zero (truncation) |
| `2` | `ROUND_CEIL` | Toward +∞ |
| `3` | `ROUND_FLOOR` | Toward −∞ |
| `4` | `ROUND_HALF_UP` | Half away from zero *(default)* |
| `5` | `ROUND_HALF_DOWN` | Half toward zero |
| `6` | `ROUND_HALF_EVEN` | Half to nearest even (banker's rounding) |
| `7` | `ROUND_HALF_CEIL` | Half toward +∞ |
| `8` | `ROUND_HALF_FLOOR` | Half toward −∞ |

```ts
const v = new FixedPrecision("1.50000000");

v.round(0, 0); // ROUND_UP        → "2.00000000"
v.round(0, 1); // ROUND_DOWN      → "1.00000000"
v.round(0, 2); // ROUND_CEIL      → "2.00000000"
v.round(0, 3); // ROUND_FLOOR     → "1.00000000"
v.round(0, 4); // ROUND_HALF_UP   → "2.00000000"
v.round(0, 5); // ROUND_HALF_DOWN → "1.00000000"
v.round(0, 6); // ROUND_HALF_EVEN → "2.00000000"
v.round(0, 7); // ROUND_HALF_CEIL → "2.00000000"
v.round(0, 8); // ROUND_HALF_FLOOR→ "1.00000000"
```

Half-even behavior at tie values:

```ts
const v1 = new FixedPrecision("0.50000000");
const v2 = new FixedPrecision("1.50000000");

v1.round(0, 6); // "0.00000000" (ties to even → 0)
v2.round(0, 6); // "2.00000000" (ties to even → 2)
```

## `round(dp?, rm?)`

Rounds the value to a given number of decimal places. When `dp` is omitted, it rounds to the context's own `places` (a no-op for the integer part if already at that scale). The result keeps the original context scale.

```ts
const value = new FixedPrecision("123.45678900");

value.round(2).toString();      // "123.46"
value.round(0).toString();      // "123"
value.round(4, 1).toString();   // "123.4567"  (ROUND_DOWN)
value.round(8, 0).toString();   // "123.45678900" (same scale, ROUND_UP)
```

Negative numbers respect the rounding mode:

```ts
const neg = new FixedPrecision("-1.50000000");

neg.round(0, 0).toString(); // "-2" (ROUND_UP: away from zero)
neg.round(0, 1).toString(); // "-1" (ROUND_DOWN: toward zero)
neg.round(0, 2).toString(); // "-1" (ROUND_CEIL: toward +∞)
neg.round(0, 3).toString(); // "-2" (ROUND_FLOOR: toward −∞)
neg.round(0, 4).toString(); // "-2" (ROUND_HALF_UP)
```

## `scale(newScale, rm?)`

Changes the number of decimal places. Unlike `round()`, which only adjusts the integer part within the same scale, `scale()` returns an instance with a **new context** whose `places` equals `newScale`. The string output reflects the new scale.

```ts
const value = new FixedPrecision("123.45678900");

// Reduce decimal places
const a = value.scale(2);
a.toString(); // "123.46"
a.places();   // 2

// Increase decimal places (zero-padded right)
const b = value.scale(12);
b.toString(); // "123.456789000000"
b.places();   // 12

// With explicit rounding mode
const c = value.scale(2, 1);
c.toString(); // "123.45" (ROUND_DOWN)
```

When scaling from fewer to more places, the value is zero-extended:

```ts
const short = new FixedPrecision("1.23");
short.scale(6).toString(); // "1.230000"
```

## `prec(sd, rm?)`

Rounds to a given number of **significant digits**. The result keeps the original context scale.

```ts
const value = new FixedPrecision("9876.54321000");

value.prec(1).toString();  // "10000.00000000"
value.prec(2).toString();  // "9900.00000000"
value.prec(3).toString();  // "9880.00000000"
value.prec(7).toString();  // "9876.54300000"
value.prec(12).toString(); // "9876.54321000" (no change — already 12 sd)
```

With rounding modes:

```ts
const down = 1;   // ROUND_DOWN
const halfUp = 4; // ROUND_HALF_UP

value.prec(1, down).toString();   // "9000.00000000"
value.prec(1, halfUp).toString(); // "10000.00000000"
```

For values less than 1, leading zeros after the decimal point are not significant:

```ts
const small = new FixedPrecision("0.00123456000");

small.prec(1).toString(); // "0.00100000000"
small.prec(3).toString(); // "0.00123000000"
small.prec(5).toString(); // "0.00123460000"
```

## `ceil()`, `floor()`, `trunc()`

Convenience methods equivalent to `round(0, rm)`:

```ts
const pos = new FixedPrecision("123.45678900");
const neg = new FixedPrecision("-123.45678900");

// ceil: always toward +∞
pos.ceil().toString(); // "124.00000000"
neg.ceil().toString(); // "-123.00000000"

// floor: always toward −∞
pos.floor().toString(); // "123.00000000"
neg.floor().toString(); // "-124.00000000"

// trunc: always toward zero (same as ROUND_DOWN)
pos.trunc().toString(); // "123.00000000"
neg.trunc().toString(); // "-123.00000000"
```

## `toNearest(increment, rm?)`

Rounds to the nearest multiple of the given increment.

```ts
const value = new FixedPrecision("123.45678900");
const step = new FixedPrecision("0.25");

value.toNearest(step).toString(); // "123.50"
value.toNearest("1.0").toString(); // "123.00"
value.toNearest("0.05").toString();  // "123.45"
```

With custom rounding mode:

```ts
value.toNearest(step, 1).toString(); // "123.25" (ROUND_DOWN)
```

Throws if increment is zero.

## `shiftedBy(n)`

Shifts the raw bigint by powers of ten. Positive `n` multiplies by `10^n`; negative `n` divides by `10^|n|` (truncating toward zero when not exact).

```ts
const v = new FixedPrecision("1.00000000");
v.raw(); // 100000000n

v.shiftedBy(2).raw();  // 10000000000n  (×100)
v.shiftedBy(-2).raw(); // 1000000n      (÷100)

// Truncation on inexact division
new FixedPrecision("1.23000000").shiftedBy(-1).raw(); // 12300000n
```

See [Conversion Methods](conversion.md) for formatting and base conversion methods like `toFixed`, `toExponential`, `toPrecision`, `toBinary`, `toOctal`, and `toHex`.

## Important: Context Scale Preservation

`round()`, `prec()`, `ceil()`, `floor()`, `trunc()`, and `toNearest()` all preserve the original context scale. Only `scale()` creates an instance with a different `places`:

```ts
const v = new FixedPrecision("123.45678900");

v.round(2).places();   // 8 (same context)
v.prec(4).places();    // 8 (same context)
v.scale(2).places();   // 2 (new context)
v.toFixed(2).places(); // 2 (internally calls scale)
```

## Factory Rounding Modes

Factories let you lock in a rounding mode globally for a set of values:

```ts
const Bankers = FixedPrecision.create({ places: 2, roundingMode: 6 }); // HALF_EVEN
const Up = FixedPrecision.create({ places: 2, roundingMode: 0 });      // ROUND_UP

const a = Bankers("1.005"); // rounds to "1.01" via HALF_EVEN → "1.01" (ties to even, 0 is even)
const b = Bankers("1.015"); // "1.02" (ties to even, 2 is even)
const c = Up("1.005");      // "1.01" (ROUND_UP)
```

## Next Steps

- [Arithmetic Operations](arithmetic.md) — add, sub, mul, div, mod
- [API Reference](api-reference.md) — complete method signatures
- [Factories](factories.md) — immutable precision contexts
