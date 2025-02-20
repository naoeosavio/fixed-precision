# FixedPrecision

FixedPrecision is a library for handling fixed-precision decimal numbers in JavaScript/TypeScript. By leveraging `BigInt` to store scaled values internally, this library enables precise arithmetic operations, detailed control over decimal places, and various rounding modes. This approach is especially useful for avoiding the imprecision inherent to floating-point representations.

## Features

- **Configurable Precision:** Set the number of decimal places from 1 to 20 for your calculations.
- **Multiple Rounding Modes:** Support for modes such as ROUND_UP, ROUND_DOWN, ROUND_CEIL, ROUND_FLOOR, ROUND_HALF_UP, and more.
- **Comprehensive Arithmetic Operations:** Perform addition, subtraction, multiplication, division, exponentiation, modulo, and even square root calculations.
- **Flexible Conversions:** Convert between `string`, `number`, `bigint`, and FixedPrecision instances seamlessly.
- **Formatting Utilities:** Retrieve representations in fixed, exponential, or custom precision notation.
- **Random Number Generation:** Create random numbers with a specified number of decimal places.

## Installation

Install the package via npm:

```bash
npm install fixed-decimal
```

## Basic Usage

Below is an example of how to get started with FixedPrecision:

```ts
import FixedPrecision, { fixedconfig } from 'fixed-decimal';

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

// Conversions
console.log("As a number:", sum.toNumber());
console.log("As a string:", sum.toString());

// Rounding
const rounded = sum.round(2); // Round to 2 decimal places
console.log("Rounded:", rounded.toString());
```

## API Overview

### Constructor

Creates a new FixedPrecision instance from one of the following types:  
`string | number | bigint | FixedPrecision`

```ts
new FixedPrecision(value);
```

### Conversion Methods

- **`toString()`**: Returns the decimal value as a string.
- **`toNumber()`**: Converts the fixed decimal to a JavaScript number.
- **`toJSON()`**: Serializes the value to JSON by returning its string representation.

### Arithmetic Operations

- **`add(other: FixedPrecision): FixedPrecision`**: Adds the given FixedPrecision to the current value.
- **`sub(other: FixedPrecision): FixedPrecision`**: Subtracts the given FixedPrecision from the current value.
- **`mul(other: FixedPrecision): FixedPrecision`**: Multiplies the current value by another FixedPrecision.
- **`div(other: FixedPrecision): FixedPrecision`**: Divides the current value by another FixedPrecision (throws an error on division by zero).
- **`mod(other: FixedPrecision): FixedPrecision`**: Returns the remainder of the division (modulus operation).
- **`pow(exp: number): FixedPrecision`**: Raises the value to an integer exponent.
- **`sqrt(): FixedPrecision`**: Computes the square root of the current value (throws an error for negative numbers).

### Comparison Methods

- **`cmp(other: FixedPrecision): -1 | 0 | 1`**: Compares two FixedPrecisions, returning -1 if less than, 0 if equal, and 1 if greater than.
- **`eq(other: FixedPrecision): boolean`**: Checks if two FixedPrecisions are equal.
- **`gt(other: FixedPrecision): boolean`**: Returns `true` if the current value is greater than the given value.
- **`gte(other: FixedPrecision): boolean`**: Returns `true` if the current value is greater than or equal to the given value.
- **`lt(other: FixedPrecision): boolean`**: Returns `true` if the current value is less than the given value.
- **`lte(other: FixedPrecision): boolean`**: Returns `true` if the current value is less than or equal to the given value.

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
  places: 8,         // Number of decimal places (between 1 and 20)
  roundingMode: 4,   // Default rounding mode
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

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more details.
