# API Reference

Complete API documentation for FixedPrecision.

## Table of Contents

- [Constructor](#constructor)
- [Static Methods](#static-methods)
- [Instance Methods](#instance-methods)
  - [Conversion Methods](#conversion-methods)
  - [Arithmetic Operations](#arithmetic-operations)
  - [Raw Operations](#raw-operations)
  - [Comparison Methods](#comparison-methods)
  - [Raw Comparison Methods](#raw-comparison-methods)
  - [Rounding & Scaling](#rounding--scaling)
  - [Utility Methods](#utility-methods)
- [Types](#types)
- [Configuration](#configuration)

## Constructor

### `new FixedPrecision(value: FixedPrecisionValue, ctx?: FPContext)`

Creates a new FixedPrecision instance.

**Parameters:**
- `value`: `string | number | bigint | FixedPrecision` - The value to create
- `ctx`: `FPContext` (optional) - Precision context (defaults to global config)

**Returns:** `FixedPrecision`

**Examples:**
```typescript
// From string (decimal value)
new FixedPrecision("123.45");

// From number (decimal value)
new FixedPrecision(123.45);

// From bigint (pre-scaled value!)
new FixedPrecision(12345000000n); // Represents 123.45 with 8 decimals

// From another FixedPrecision
const a = new FixedPrecision("100.00");
const b = new FixedPrecision(a);

// With explicit context
const ctx = FixedPrecision.makeContext(4, 4); // 4 decimals, ROUND_HALF_UP
new FixedPrecision("123.4567", ctx);
```

**⚠️ Important:** BigInt values are treated as **pre-scaled**, not decimal values.

## Static Methods

### `FixedPrecision.create(config: FixedPrecisionConfig)`

Creates a factory function for a specific precision context.

**Parameters:**
- `config`: `{ places: number, roundingMode?: RoundingMode }`

**Returns:** `(value: FixedPrecisionValue) => FixedPrecision`

**Example:**
```typescript
const FP8 = FixedPrecision.create({ places: 8 });
const FP2 = FixedPrecision.create({ places: 2 });

const a = FP8("1.23456789"); // "1.23456789"
const b = FP2("1.23");       // "1.23"
```

### `FixedPrecision.random(decimalPlaces?: number)`

Generates a random FixedPrecision value between 0 (inclusive) and 1 (exclusive).

**Parameters:**
- `decimalPlaces`: `number` (optional) - Number of decimal places (defaults to global config)

**Returns:** `FixedPrecision`

**Example:**
```typescript
const random = FixedPrecision.random(4); // Random value with 4 decimals
```

### `FixedPrecision.configure(config: FixedPrecisionConfig)`

Configures global defaults.

**Parameters:**
- `config`: `{ places: number, roundingMode?: RoundingMode }`

**Returns:** `void`

**Example:**
```typescript
FixedPrecision.configure({ places: 4, roundingMode: 4 });
```

### `FixedPrecision.makeContext(places: number, roundingMode: RoundingMode)`

Creates a precision context object.

**Parameters:**
- `places`: `number` - Number of decimal places (0-20)
- `roundingMode`: `RoundingMode` - Rounding mode (0-8)

**Returns:** `FPContext`

**Note:** This is an internal method but can be used for advanced scenarios.

## Instance Methods

### Conversion Methods

#### `toString(): string`

Returns the decimal value as a string.

**Returns:** `string`

**Example:**
```typescript
const value = new FixedPrecision("123.456789");
value.toString(); // "123.45678900"
```

#### `toNumber(): number`

Converts the fixed decimal to a JavaScript number.

**Returns:** `number`

**Example:**
```typescript
const value = new FixedPrecision("123.456789");
value.toNumber(); // 123.456789
```

**Note:** May lose precision for very large or very small values.

#### `toJSON(): string`

Serializes the value to JSON by returning its string representation.

**Returns:** `string`

**Example:**
```typescript
const value = new FixedPrecision("123.45");
JSON.stringify({ amount: value }); // '{"amount":"123.45000000"}'
```

### Arithmetic Operations

#### `add(other: FixedPrecisionValue): FixedPrecision`

Adds another value to this value (with scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to add

**Returns:** `FixedPrecision` - New instance with result

**Example:**
```typescript
const a = new FixedPrecision("10.50");
const b = new FixedPrecision("5.25");
a.add(b); // "15.75000000"
```

#### `sub(other: FixedPrecisionValue): FixedPrecision`

Subtracts another value from this value (with scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to subtract

**Returns:** `FixedPrecision` - New instance with result

**Example:**
```typescript
const a = new FixedPrecision("10.50");
const b = new FixedPrecision("5.25");
a.sub(b); // "5.25000000"
```

#### `mul(other: FixedPrecisionValue): FixedPrecision`

Multiplies this value by another value (with scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to multiply by

**Returns:** `FixedPrecision` - New instance with result

**Example:**
```typescript
const price = new FixedPrecision("19.99");
const quantity = new FixedPrecision(3);
price.mul(quantity); // "59.97000000"
```

#### `div(other: FixedPrecisionValue): FixedPrecision`

Divides this value by another value (with scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to divide by

**Returns:** `FixedPrecision` - New instance with result

**Throws:** `Error` if dividing by zero

**Example:**
```typescript
const total = new FixedPrecision("100.00");
const people = new FixedPrecision(4);
total.div(people); // "25.00000000"
```

#### `mod(other: FixedPrecisionValue): FixedPrecision`

Returns the remainder of dividing this value by another value (with scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Divisor

**Returns:** `FixedPrecision` - New instance with remainder

**Example:**
```typescript
const amount = new FixedPrecision("10.50");
const divisor = new FixedPrecision("3.00");
amount.mod(divisor); // "1.50000000"
```

#### `pow(exp: number): FixedPrecision`

Raises this value to an integer exponent.

**Parameters:**
- `exp`: `number` - Integer exponent

**Returns:** `FixedPrecision` - New instance with result

**Throws:** `Error` if exponent is not an integer

**Example:**
```typescript
const base = new FixedPrecision("2.00");
base.pow(3); // "8.00000000"
base.pow(-1); // "0.50000000"
```

#### `sqrt(): FixedPrecision`

Computes the square root of this value.

**Returns:** `FixedPrecision` - New instance with square root

**Throws:** `Error` if value is negative

**Example:**
```typescript
const value = new FixedPrecision("16.00");
value.sqrt(); // "4.00000000"
```

#### `neg(): FixedPrecision`

Returns the negation of this value.

**Returns:** `FixedPrecision` - New instance with negated value

**Example:**
```typescript
const value = new FixedPrecision("100.00");
value.neg(); // "-100.00000000"
```

### Raw Operations

#### `plus(other: FixedPrecisionValue): FixedPrecision`

Returns the raw sum (without scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to add

**Returns:** `FixedPrecision` - New instance with raw sum

**Example:**
```typescript
const a = new FixedPrecision("1.23");
const b = new FixedPrecision("2.00");
a.plus(b); // "3.23000000"
```

#### `minus(other: FixedPrecisionValue): FixedPrecision`

Returns the raw difference (without scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to subtract

**Returns:** `FixedPrecision` - New instance with raw difference

**Example:**
```typescript
const a = new FixedPrecision("5.00");
const b = new FixedPrecision("2.50");
a.minus(b); // "2.50000000"
```

#### `product(other: FixedPrecisionValue): FixedPrecision`

Returns the raw product (without scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to multiply by

**Returns:** `FixedPrecision` - New instance with raw product

**Example:**
```typescript
const a = new FixedPrecision("1.23");
const b = new FixedPrecision("2.00");
a.product(b); // "246000000.00000000"
```

#### `fraction(other: FixedPrecisionValue): FixedPrecision`

Returns the raw quotient (without scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to divide by

**Returns:** `FixedPrecision` - New instance with raw quotient

**Example:**
```typescript
const a = new FixedPrecision("10.00");
const b = new FixedPrecision("2.00");
a.fraction(b); // "5.00000000"
```

#### `leftover(other: FixedPrecisionValue): FixedPrecision`

Returns the raw remainder (without scaling).

**Parameters:**
- `other`: `FixedPrecisionValue` - Divisor

**Returns:** `FixedPrecision` - New instance with raw remainder

**Example:**
```typescript
const a = new FixedPrecision("10.50");
const b = new FixedPrecision("3.00");
a.leftover(b); // "1.50000000"
```

### Comparison Methods

#### `cmp(other: FixedPrecisionValue): Comparison`

Compares two values.

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `-1 | 0 | 1`
  - `-1`: This value is less than other
  - `0`: This value equals other
  - `1`: This value is greater than other

**Example:**
```typescript
const a = new FixedPrecision("10.00");
const b = new FixedPrecision("5.00");
a.cmp(b); // 1 (a > b)
```

#### `eq(other: FixedPrecisionValue): boolean`

Checks if two values are equal.

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("10.00");
const b = new FixedPrecision("10.00");
a.eq(b); // true
```

#### `gt(other: FixedPrecisionValue): boolean`

Checks if this value is greater than another value.

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("10.00");
const b = new FixedPrecision("5.00");
a.gt(b); // true
```

#### `gte(other: FixedPrecisionValue): boolean`

Checks if this value is greater than or equal to another value.

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("10.00");
const b = new FixedPrecision("10.00");
a.gte(b); // true
```

#### `lt(other: FixedPrecisionValue): boolean`

Checks if this value is less than another value.

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("5.00");
const b = new FixedPrecision("10.00");
a.lt(b); // true
```

#### `lte(other: FixedPrecisionValue): boolean`

Checks if this value is less than or equal to another value.

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("10.00");
const b = new FixedPrecision("10.00");
a.lte(b); // true
```

### Raw Comparison Methods

#### `cmpRaw(other: FixedPrecisionValue): Comparison`

Compares raw scaled values (without configuration validation).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `-1 | 0 | 1`

**Example:**
```typescript
const a = new FixedPrecision("1.23");
const b = FixedPrecision.create({ places: 2 })("2.00");
a.cmpRaw(b); // 1 (123000000 > 200)
```

#### `eqRaw(other: FixedPrecisionValue): boolean`

Checks if raw scaled values are equal (without configuration validation).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("1.2300");
const b = FixedPrecision.create({ places: 4 })("1.23");
a.eqRaw(b); // true (both scaled to same value)
```

#### `gtRaw(other: FixedPrecisionValue): boolean`

Checks if this raw scaled value is greater than another (without configuration validation).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("1.23");
const b = FixedPrecision.create({ places: 2 })("2.00");
a.gtRaw(b); // true (123000000 > 200)
```

#### `gteRaw(other: FixedPrecisionValue): boolean`

Checks if this raw scaled value is greater than or equal to another (without configuration validation).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("1.23");
const b = FixedPrecision.create({ places: 2 })("1.23");
a.gteRaw(b); // true (123000000 >= 123)
```

#### `ltRaw(other: FixedPrecisionValue): boolean`

Checks if this raw scaled value is less than another (without configuration validation).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("1.23");
const b = FixedPrecision.create({ places: 2 })("0.01");
a.ltRaw(b); // false (123000000 > 1)
```

#### `lteRaw(other: FixedPrecisionValue): boolean`

Checks if this raw scaled value is less than or equal to another (without configuration validation).

**Parameters:**
- `other`: `FixedPrecisionValue` - Value to compare with

**Returns:** `boolean`

**Example:**
```typescript
const a = new FixedPrecision("1.23");
const b = FixedPrecision.create({ places: 2 })("1.23");
a.lteRaw(b); // true (123000000 <= 123)
```

### Rounding & Scaling

#### `round(dp?: number, rm?: RoundingMode): FixedPrecision`

Rounds the value to the specified number of decimal places.

**Parameters:**
- `dp`: `number` (optional) - Decimal places (defaults to context places)
- `rm`: `RoundingMode` (optional) - Rounding mode (defaults to context rounding mode)

**Returns:** `FixedPrecision` - New instance with rounded value

**Example:**
```typescript
const value = new FixedPrecision("123.456789");
value.round(2); // "123.46"
value.round(4, 1); // "123.4567" (ROUND_DOWN)
```

#### `ceil(): FixedPrecision`

Returns the ceiling of the value (rounds upward for positive numbers).

**Returns:** `FixedPrecision` - New instance with ceiling value

**Example:**
```typescript
const value = new FixedPrecision("123.45");
value.ceil(); // "124.00000000"
```

#### `floor(): FixedPrecision`

Returns the floor of the value (rounds downward for positive numbers).

**Returns:** `FixedPrecision` - New instance with floor value

**Example:**
```typescript
const value = new FixedPrecision("123.45");
value.floor(); // "123.00000000"
```

#### `trunc(): FixedPrecision`

Truncates the value (removes fractional part, rounds toward zero).

**Returns:** `FixedPrecision` - New instance with truncated value

**Example:**
```typescript
const value = new FixedPrecision("123.45");
value.trunc(); // "123.00000000"
```

#### `scale(newScale: number, rm?: RoundingMode): FixedPrecision`

Adjusts the value to a new number of decimal places.

**Parameters:**
- `newScale`: `number` - New number of decimal places (0-20)
- `rm`: `RoundingMode` (optional) - Rounding mode for adjustment

**Returns:** `FixedPrecision` - New instance with adjusted scale

**Example:**
```typescript
const value = new FixedPrecision("123.456789");
value.scale(2); // "123.46"
value.scale(4); // "123.4568"
```

#### `shiftedBy(n: number): FixedPrecision`

Shifts the value by `n` decimal places.

**Parameters:**
- `n`: `number` - Number of decimal places to shift
  - Positive: multiplies by 10ⁿ
  - Negative: divides by 10ⁿ (must be exact)

**Returns:** `FixedPrecision` - New instance with shifted value

**Throws:** `Error` if negative shift is inexact

**Example:**
```typescript
const value = new FixedPrecision("123.45");
value.shiftedBy(2); // "12345.00" (×100)
value.shiftedBy(-1); // "12.345" (÷10)
```

### Utility Methods

#### `isZero(): boolean`

Checks if the value is zero.

**Returns:** `boolean`

**Example:**
```typescript
const value = new FixedPrecision("0.00");
value.isZero(); // true
```

#### `isPositive(): boolean`

Checks if the value is positive.

**Returns:** `boolean`

**Example:**
```typescript
const value = new FixedPrecision("100.00");
value.isPositive(); // true
```

#### `isNegative(): boolean`

Checks if the value is negative.

**Returns:** `boolean`

**Example:**
```typescript
const value = new FixedPrecision("-100.00");
value.isNegative(); // true
```

#### `abs(): FixedPrecision`

Returns the absolute value.

**Returns:** `FixedPrecision` - New instance with absolute value

**Example:**
```typescript
const value = new FixedPrecision("-100.00");
value.abs(); // "100.00000000"
```

## Types

### `FixedPrecisionValue`

```typescript
type FixedPrecisionValue = string | number | bigint | FixedPrecision;
```

Union type accepted by all arithmetic and comparison methods.

### `Comparison`

```typescript
type Comparison = -1 | 0 | 1;
```

Result type for comparison operations.

### `RoundingMode`

```typescript
type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
```

Rounding modes:
- `0`: ROUND_UP - Away from zero
- `1`: ROUND_DOWN - Toward zero (truncation)
- `2`: ROUND_CEIL - Toward +∞
- `3`: ROUND_FLOOR - Toward -∞
- `4`: ROUND_HALF_UP - Half away from zero (default)
- `5`: ROUND_HALF_DOWN - Half toward zero
- `6`: ROUND_HALF_EVEN - Half to nearest even
- `7`: ROUND_HALF_CEIL - Half toward +∞
- `8`: ROUND_HALF_FLOOR - Half toward -∞

### `FixedPrecisionConfig`

```typescript
interface FixedPrecisionConfig {
  places: number;          // 0-20
  roundingMode?: RoundingMode; // Optional, defaults to 4
}
```

Configuration object for precision contexts.

## Configuration

### Global Configuration

```typescript
import { fixedconfig } from "fixed-precision";

// Configure global defaults
fixedconfig.configure({ places: 4, roundingMode: 4 });

// Or use static method
FixedPrecision.configure({ places: 4, roundingMode: 4 });
```

### Per-Instance Configuration

```typescript
// Create factory with specific configuration
const FP4 = FixedPrecision.create({ places: 4 });
const FP2 = FixedPrecision.create({ places: 2 });

// Use factories
const a = FP4("1.2345"); // "1.2345"
const b = FP2("1.23");   // "1.23"
```

### Context Properties

Each FixedPrecision instance has a context with:
- `ctx.places`: Number of decimal places
- `ctx.roundingMode`: Current rounding mode
- `ctx.SCALE`: Scale factor (10^places as bigint)

**Note:** These are internal properties and should not be modified directly.