# FixedPrecision

FixedPrecision is a library for handling fixed-precision decimal numbers in JavaScript/TypeScript. By leveraging `BigInt` to store scaled values internally, this library enables precise arithmetic operations, detailed control over decimal places, and various rounding modes. This approach is especially useful for avoiding the imprecision inherent to floating-point representations.

## Features

- **Configurable Precision:** Set the number of decimal places from 0 to 20 for your calculations.
- **Multiple Rounding Modes:** Support for modes such as ROUND_UP, ROUND_DOWN, ROUND_CEIL, ROUND_FLOOR, ROUND_HALF_UP, and more.
- **Comprehensive Arithmetic Operations:** Perform addition, subtraction, multiplication, division, exponentiation, modulo, and even square root calculations.
- **Method Chaining with Raw Values:** Perform arithmetic and comparison operations directly with numbers, strings, or bigints without explicit FixedPrecision instantiation.
- **Flexible Conversions:** Convert between `string`, `number`, `bigint`, and FixedPrecision instances seamlessly.
- **Formatting Utilities:** Retrieve representations in fixed, exponential, or custom precision notation.
- **Random Number Generation:** Create random numbers with a specified number of decimal places.

## Installation

Install the package via npm:

```bash
npm install fixed-precision
```

## Basic Usage

Below is an example of how to get started with FixedPrecision:

```ts
import FixedPrecision, { fixedconfig } from "fixed-precision";

// Optional: Configure the library globally
// Set 8 decimal places and use ROUND_HALF_UP (4) as the default rounding mode
fixedconfig.configure({ places: 8, roundingMode: 4 });

// Create FixedPrecision instances from various input types
const a = new FixedPrecision("1.2345");
const b = new FixedPrecision(2.3456);

// Arithmetic operations
const sum = a.add(b);
console.log("Sum:", sum.toString());

const product = a.mul(b);
console.log("Product:", product.toString());

// Chaining with raw numbers (new feature)
const result = new FixedPrecision(10.5).add(5).div(3).toNumber();
console.log("Chained result:", result); // 5.16666667

// Mixed input types
const mixed = new FixedPrecision(100).add("50").sub(25n).mul(2).div("5");
console.log("Mixed types:", mixed.toString()); // 50.00000000

// Conversions
console.log("As a number:", sum.toNumber());
console.log("As a string:", sum.toString());

// Rounding
const rounded = sum.round(2); // Round to 2 decimal places
console.log("Rounded:", rounded.toString());
```

## Method Chaining with Raw Values

FixedPrecision now supports arithmetic and comparison operations with raw values (numbers, strings, bigints) in addition to FixedPrecision instances. This enables cleaner, more concise code through method chaining.

### Examples

```typescript
// Clean chaining without explicit instantiation
const result = new FixedPrecision(10.5).add(5).div(3).toNumber();
// Result: 5.16666667

// Mixed input types in a single chain
const mixed = new FixedPrecision(100).add("50").sub(25n).mul(2).div("5");
// Result: 50.00000000

// Comparison with raw values
const isGreater = new FixedPrecision(10.5).add(5).gt(15); // true
const isEqual = new FixedPrecision(10).mul(2).eq(20); // true

// Complex calculations
const complex = new FixedPrecision(1000)
  .add(500)
  .sub("250")
  .mul(2n)
  .div(5)
  .mod(3);
```

### Benefits

1. **Reduced Verbosity**: No need to wrap every operand in `new FixedPrecision()`
2. **Improved Readability**: Code reads more naturally like mathematical expressions
3. **Flexibility**: Mix and match input types as needed
4. **Backwards Compatible**: Existing code using FixedPrecision instances continues to work unchanged

### Type Support
All arithmetic and comparison methods accept `FixedPrecisionValue`, which is defined as:
```typescript
type FixedPrecisionValue = string | number | bigint | FixedPrecision;
```

### Configuration Safety
When operating with other FixedPrecision instances, the library validates that both instances have the same precision configuration (decimal places and rounding mode). Raw values are automatically converted using the current instance's context.

## API Overview

### Constructor

Creates a new FixedPrecision instance from one of the following types:  
`string | number | bigint | FixedPrecision`

```ts
new FixedPrecision(value);
```

**Note:** All arithmetic and comparison methods now also accept these same types, enabling method chaining with raw values.

### Conversion Methods

- **`toString()`**: Returns the decimal value as a string.
- **`toNumber()`**: Converts the fixed decimal to a JavaScript number.
- **`toJSON()`**: Serializes the value to JSON by returning its string representation.

### Arithmetic Operations

- **`add(other: FixedPrecisionValue): FixedPrecision`**: Adds the given value to the current value. Accepts FixedPrecision instance, number, string, or bigint.
- **`plus(other: FixedPrecisionValue): FixedPrecision`**: Alias for `add()`.
- **`sub(other: FixedPrecisionValue): FixedPrecision`**: Subtracts the given value from the current value. Accepts FixedPrecision instance, number, string, or bigint.
- **`minus(other: FixedPrecisionValue): FixedPrecision`**: Alias for `sub()`.
- **`mul(other: FixedPrecisionValue): FixedPrecision`**: Multiplies the current value by another value. Accepts FixedPrecision instance, number, string, or bigint.
- **`product(other: FixedPrecisionValue): FixedPrecision`**: Returns the raw product (without scaling). Accepts FixedPrecision instance, number, string, or bigint.
- **`div(other: FixedPrecisionValue): FixedPrecision`**: Divides the current value by another value (throws an error on division by zero). Accepts FixedPrecision instance, number, string, or bigint.
- **`fraction(other: FixedPrecisionValue): FixedPrecision`**: Returns the raw quotient (without scaling). Accepts FixedPrecision instance, number, string, or bigint.
- **`mod(other: FixedPrecisionValue): FixedPrecision`**: Returns the remainder of the division (modulus operation). Accepts FixedPrecision instance, number, string, or bigint.
- **`leftover(other: FixedPrecisionValue): FixedPrecision`**: Returns the raw remainder (without scaling). Accepts FixedPrecision instance, number, string, or bigint.
- **`pow(exp: number): FixedPrecision`**: Raises the value to an integer exponent.
- **`sqrt(): FixedPrecision`**: Computes the square root of the current value (throws an error for negative numbers).

### Comparison Methods

- **`cmp(other: FixedPrecisionValue): -1 | 0 | 1`**: Compares two values, returning -1 if less than, 0 if equal, and 1 if greater than. Accepts FixedPrecision instance, number, string, or bigint.
- **`eq(other: FixedPrecisionValue): boolean`**: Checks if two values are equal. Accepts FixedPrecision instance, number, string, or bigint.
- **`gt(other: FixedPrecisionValue): boolean`**: Returns `true` if the current value is greater than the given value. Accepts FixedPrecision instance, number, string, or bigint.
- **`gte(other: FixedPrecisionValue): boolean`**: Returns `true` if the current value is greater than or equal to the given value. Accepts FixedPrecision instance, number, string, or bigint.
- **`lt(other: FixedPrecisionValue): boolean`**: Returns `true` if the current value is less than the given value. Accepts FixedPrecision instance, number, string, or bigint.
- **`lte(other: FixedPrecisionValue): boolean`**: Returns `true` if the current value is less than or equal to the given value. Accepts FixedPrecision instance, number, string, or bigint.

### Rounding and Scaling

- **`round(dp?: number, rm?: RoundingMode): FixedPrecision`**  
  Rounds the value to the specified number of decimal places (`dp`) using the rounding mode (`rm`).  
  _Example:_ `value.round(2)` rounds the value to 2 decimal places.

- **`ceil(): FixedPrecision`**  
  Returns the ceiling of the value (rounds upward for positive numbers).

- **`floor(): FixedPrecision`**  
  Returns the floor of the value (rounds downward for positive numbers).

- **`trunc(): FixedPrecision`**  
  Truncates the value, effectively removing the fractional part (rounds toward zero).

- **`scale(newScale: number): FixedPrecision`**  
  Adjusts the value to a new number of decimal places by scaling and rounding as necessary.

- **`shiftedBy(n: number): FixedPrecision`**  
  Shifts the value by `n` decimal places. A positive `n` multiplies the value by 10ⁿ; a negative `n` divides it (throws an error if the division is inexact).

### Random Number Generation

- **`FixedPrecision.random(decimalPlaces?: number): FixedPrecision`**  
  Generates a random FixedPrecision value between 0 (inclusive) and 1 (exclusive) with the specified number of decimal places (default is the value defined in `FixedPrecision.format.places`).

### Global Configuration

Configure global settings such as the default number of decimal places and rounding mode using:

```ts
FixedPrecision.configure({
  places: 8, // Number of decimal places (between 0 and 20)
  roundingMode: 4, // Default rounding mode
});
```

#### Supported Rounding Modes

- **0:** ROUND_UP – Rounds away from zero.
- **1:** ROUND_DOWN – Rounds toward zero (truncation).
- **2:** ROUND_CEIL – Rounds toward +Infinity.
- **3:** ROUND_FLOOR – Rounds toward -Infinity.
- **4:** ROUND_HALF_UP – Rounds half up (away from zero if exactly half).
- **5:** ROUND_HALF_DOWN – Rounds half down (toward zero if exactly half).
- **6:** ROUND_HALF_EVEN – Rounds to the nearest even number in case of a tie.
- **7:** ROUND_HALF_CEIL – In a tie, rounds toward +Infinity.
- **8:** ROUND_HALF_FLOOR – In a tie, rounds toward -Infinity.

## Precision Factories (Recommended)

For applications that need multiple precisions at the same time, use immutable factories instead of mutating global configuration.

Create isolated precision contexts with `FixedPrecision.create`:

```ts
import FixedPrecision, { fixedconfig } from "fixed-precision";

// Independent factories
const FP8 = FixedPrecision.create({ places: 8, roundingMode: 4 });
const FP2 = FixedPrecision.create({ places: 2 }); // default roundingMode=4

const a = FP8("1.23456789"); // → "1.23456789" (8 places)
const b = FP2("1.23");      // → "1.23"       (2 places)

// Raw values work with factories too
const result = FP8(10.5).add(5).div(3); // Works with raw numbers

// Each factory is immutable and independent
// Changing global config does not affect existing factories
fixedconfig.configure({ places: 4 });
FP8("1").toString(); // "1.00000000"
FP2("1").toString(); // "1.00"
new FixedPrecision("1").toString(); // "1.0000" (global default)

// Safety: mixing different contexts throws
// FP8("1").add(FP2("1")) -> Error: Cannot operate on different precisions
```

Why factories?
- Performance: No per‑instance option parsing; the factory captures its scale.
- Clarity: The chosen precision is explicit in the factory variable.
- Safety: No shared mutable state; cross-context arithmetic is rejected.
- Flexibility: Create as many contexts as you need and pass them around.

API
- `FixedPrecision.create({ places: number, roundingMode?: RoundingMode })` → factory function
  - Call the factory as `factory(value)` to construct an instance in that context.
  - `factory.format` is a frozen object with `{ places, roundingMode }`.

Notes
- Global configuration still works via `fixedconfig.configure(...)` or `FixedPrecision.configure(...)` for the default context.
- Methods like `round`, `toFixed`, and `toExponential` default to the context’s `places` and `roundingMode` when parameters are omitted.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.
