# Conversion Methods

FixedPrecision provides several ways to convert between types and formats.

## Converting to String

### `toString(trimZeros?)`

Returns the decimal value as a string. By default, trailing zeros are stripped (new behavior). Pass `false` to keep trailing zeros at the context's full decimal places.

```ts
const value = new FixedPrecision("123.456789");

value.toString();       // "123.456789"   (trailing zeros stripped)
value.toString(true);   // "123.456789"   (same)
value.toString(false);  // "123.45678900" (old behavior, full 8 decimals)
```

```ts
const exact = new FixedPrecision("5.00000000");

exact.toString();       // "5"
exact.toString(false);  // "5.00000000"
```

### `valueOf()`

Called implicitly during string concatenation. Uses `toString()` (trailing zeros stripped).

```ts
const value = new FixedPrecision("50.00");
"Total: " + value; // "Total: 50"
```

### `toFixed(places?, rm?)`

Returns a string with exactly `places` decimal places. Internally calls `scale()` — the output always shows exactly `places` decimals.

```ts
const value = new FixedPrecision("123.45678900");

value.toFixed(0);  // "123"
value.toFixed(2);  // "123.46"
value.toFixed(4, 1); // "123.4567" (ROUND_DOWN)
```

### `toExponential(dp?, rm?)`

Returns the value in exponential (scientific) notation.

```ts
const big = new FixedPrecision("1234567.89000000");

big.toExponential();   // "1.23456789e6"
big.toExponential(2);  // "1.23e6"
big.toExponential(4);  // "1.2346e6"
```

### `toPrecision(sd, rm?)`

Returns a string rounded to `sd` significant digits, stripping trailing zeros. Falls back to exponential notation when the result is very large or very small.

```ts
const value = new FixedPrecision("123.45678900");

value.toPrecision(4); // "123.5"
value.toPrecision(6); // "123.457"
value.toPrecision(2); // "1.2e2"
```

### `toJSON()`

Returns the string representation of the value. Used automatically by `JSON.stringify()`.

```ts
const price = new FixedPrecision("19.99");
JSON.stringify({ amount: price }); // '{"amount":"19.99000000"}'
```

## Converting to Number

### `toNumber(places?)`

Converts the value to a JavaScript `number`. May lose precision for very large or very small values.

```ts
const value = new FixedPrecision("123.456789");
value.toNumber(); // 123.456789

// Round to fewer places before conversion
value.toNumber(2); // 123.46
```

⚠️ JavaScript numbers are IEEE-754 doubles. Values beyond `2^53` lose integer precision.

## Converting to BigInt

### `raw()`

Returns the internal scaled bigint value.

```ts
const value = new FixedPrecision("123.45678900");
value.raw(); // 12345678900n (8 decimal places × SCALE)
```

For a decimal string to bigint: `BigInt("123456789")` gives `123456789n`, but that represents `1.23456789` at 8 decimal places. Use `raw()` to get the properly scaled internal value.

## Converting Between Precisions

### `scale(newScale, rm?)`

Creates a new instance with a different number of decimal places.

```ts
const value = new FixedPrecision("123.45678900");

const precise = value.scale(12);
precise.toString(); // "123.456789000000"
precise.places();   // 12

const rounded = value.scale(2);
rounded.toString(); // "123.46"
rounded.places();   // 2
```

### Converting between factories

Numbers from different factories cannot be directly combined (they throw on mixed-precision operations). Convert the string output instead:

```ts
const Price = FixedPrecision.create({ places: 2 });
const Rate = FixedPrecision.create({ places: 6 });

const price = Price("19.99");
const rate = Rate("1.085432");

// Convert rate to price's precision via string
const converted = Price(rate.toString());
const total = price.mul(converted);
```

## Base Conversion

### `toBinary(sd?, rm?)`

Converts to a binary string representation.

```ts
const value = new FixedPrecision("255.50000000");

value.toBinary(0);        // "11111111"
value.toBinary(0, 6);     // "100000000" (HALF_EVEN rounds to 256)
value.toBinary(4);        // "11111111.1"
```

**Parameters:**
- `sd`: `number` (optional) — Number of significant digits in the fractional part
- `rm`: `RoundingMode` (optional) — Rounding mode for fractional digits

### `toOctal(sd?, rm?)`

Converts to an octal string representation.

```ts
const value = new FixedPrecision("255.50000000");

value.toOctal(0);  // "377" (255 in octal)
value.toOctal(2);  // "377.4"
```

### `toHex(sd?, rm?)` / `toHexadecimal(sd?, rm?)`

Converts to a hexadecimal string representation.

```ts
const value = new FixedPrecision("255.50000000");

value.toHex(0);  // "ff" (255 in hex)
value.toHex(2);  // "ff.8"
```

## Constructor — Creating from Different Types

### From string

```ts
new FixedPrecision("123.45");   // "123.45000000"
new FixedPrecision("1e-2");     // "0.01000000"
new FixedPrecision("-0.001");   // "-0.00100000"
```

### From number

```ts
new FixedPrecision(123.45);     // "123.45000000"
new FixedPrecision(1e-2);       // "0.01000000"
```

⚠️ Numbers may carry floating-point imprecision. Prefer strings for exact values.

### From bigint (pre-scaled!)

BigInt values are treated as **pre-scaled**, not as decimal values:

```ts
// BigInt is pre-scaled: 100000000n = 1.00000000
new FixedPrecision(100000000n).toString(); // "1.00000000"
new FixedPrecision(12345000000n).toString(); // "123.45000000"
```

### From another FixedPrecision

Creates a copy with the same precision context:

```ts
const original = new FixedPrecision("123.45");
const copy = new FixedPrecision(original);

copy.toString(); // "123.45000000"
```

### Using constructors from static methods

```ts
FixedPrecision.abs("-50.00");       // "50.00000000"
FixedPrecision.round("123.456", 2); // "123.46000000"
FixedPrecision.sqrt("16.00");       // "4.00000000"
```

## Conversion Table

| Method | Input Type | Output Type | Notes |
|--------|-----------|-------------|-------|
| `toString(trimZeros?)` | — | `string` | Strips trailing zeros by default; `false` keeps full places |
| `valueOf()` | — | `string` | Same as `toString()` |
| `toJSON()` | — | `string` | For `JSON.stringify()` |
| `toFixed(n)` | — | `string` | Exactly `n` decimal places |
| `toExponential()` | — | `string` | Scientific notation |
| `toPrecision(n)` | — | `string` | `n` significant digits |
| `toNumber()` | — | `number` | May lose precision |
| `raw()` | — | `bigint` | Scaled internal value |
| `scale(n)` | — | `FixedPrecision` | New instance, new scale |
| `toBinary()` | — | `string` | Base-2 representation |
| `toOctal()` | — | `string` | Base-8 representation |
| `toHex()` | — | `string` | Base-16 representation |
| Constructor | `string` | `FixedPrecision` | Decimal string |
| Constructor | `number` | `FixedPrecision` | Floating-point input |
| Constructor | `bigint` | `FixedPrecision` | Pre-scaled input |
| Constructor | `FixedPrecision` | `FixedPrecision` | Copy instance |

## Next Steps

- [Basic Concepts](concepts.md) — understand the internal BigInt representation
- [Arithmetic Operations](arithmetic.md) — calculations with converted values
- [Rounding & Scaling](rounding-scaling.md) — rounding modes and decimal place control
