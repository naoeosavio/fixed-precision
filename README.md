# FixedDecimal

FixedDecimal is a library for handling fixed-precision decimal numbers in JavaScript/TypeScript. By leveraging `BigInt` to store scaled values internally, this library enables precise arithmetic operations, detailed control over decimal places, and various rounding modes. This approach is especially useful for avoiding the imprecision inherent to floating-point representations.

## Features

- **Configurable Precision:** Set the number of decimal places from 1 to 20 for your calculations.
- **Multiple Rounding Modes:** Support for modes such as ROUND_UP, ROUND_DOWN, ROUND_CEIL, ROUND_FLOOR, ROUND_HALF_UP, and more.
- **Comprehensive Arithmetic Operations:** Perform addition, subtraction, multiplication, division, exponentiation, modulo, and even square root calculations.
- **Flexible Conversions:** Convert between `string`, `number`, `bigint`, and FixedDecimal instances seamlessly.
- **Formatting Utilities:** Retrieve representations in fixed, exponential, or custom precision notation.
- **Random Number Generation:** Create random numbers with a specified number of decimal places.

## Installation

Install the package via npm:

```bash
npm install fixed-decimal
```

## Basic Usage

Below is an example of how to get started with FixedDecimal:

```ts
import FixedDecimal, { fixedconfig } from 'fixed-decimal';

// Optional: Configure the library globally
// Set 8 decimal places and use ROUND_HALF_UP (4) as the default rounding mode
fixedconfig.configure({ places: 8, roundingMode: 4 });

// Create FixedDecimal instances from various input types
const a = new FixedDecimal("1.2345");
const b = new FixedDecimal(2.3456);

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

Creates a new FixedDecimal instance from one of the following types:  
`string | number | bigint | FixedDecimal`

```ts
new FixedDecimal(value);
```

### Conversion Methods

- **`toString()`**: Returns the decimal value as a string.
- **`toNumber()`**: Converts the fixed decimal to a JavaScript number.
- **`toJSON()`**: Serializes the value to JSON by returning its string representation.

### Arithmetic Operations

- **`add(other: FixedDecimal): FixedDecimal`**: Adds the given FixedDecimal to the current value.
- **`sub(other: FixedDecimal): FixedDecimal`**: Subtracts the given FixedDecimal from the current value.
- **`mul(other: FixedDecimal): FixedDecimal`**: Multiplies the current value by another FixedDecimal.
- **`div(other: FixedDecimal): FixedDecimal`**: Divides the current value by another FixedDecimal (throws an error on division by zero).
- **`mod(other: FixedDecimal): FixedDecimal`**: Returns the remainder of the division (modulus operation).
- **`pow(exp: number): FixedDecimal`**: Raises the value to an integer exponent.
- **`sqrt(): FixedDecimal`**: Computes the square root of the current value (throws an error for negative numbers).

### Comparison Methods

- **`cmp(other: FixedDecimal): -1 | 0 | 1`**: Compares two FixedDecimals, returning -1 if less than, 0 if equal, and 1 if greater than.
- **`eq(other: FixedDecimal): boolean`**: Checks if two FixedDecimals are equal.
- **`gt(other: FixedDecimal): boolean`**: Returns `true` if the current value is greater than the given value.
- **`gte(other: FixedDecimal): boolean`**: Returns `true` if the current value is greater than or equal to the given value.
- **`lt(other: FixedDecimal): boolean`**: Returns `true` if the current value is less than the given value.
- **`lte(other: FixedDecimal): boolean`**: Returns `true` if the current value is less than or equal to the given value.

### Rounding and Scaling

- **`round(dp?: number, rm?: RoundingMode): FixedDecimal`**  
  Rounds the value to the specified number of decimal places (`dp`) using the rounding mode (`rm`).  
  _Example:_ `value.round(2)` rounds the value to 2 decimal places.

- **`ceil(): FixedDecimal`**  
  Returns the ceiling of the value (rounds upward for positive numbers).

- **`floor(): FixedDecimal`**  
  Returns the floor of the value (rounds downward for positive numbers).

- **`trunc(): FixedDecimal`**  
  Truncates the value, effectively removing the fractional part (rounds toward zero).

- **`scale(newScale: number): FixedDecimal`**  
  Adjusts the value to a new number of decimal places by scaling and rounding as necessary.

- **`shiftedBy(n: number): FixedDecimal`**  
  Shifts the value by `n` decimal places. A positive `n` multiplies the value by 10ⁿ; a negative `n` divides it (throws an error if the division is inexact).

### Random Number Generation

- **`FixedDecimal.random(decimalPlaces?: number): FixedDecimal`**  
  Generates a random FixedDecimal value between 0 (inclusive) and 1 (exclusive) with the specified number of decimal places (default is the value defined in `FixedDecimal.format.places`).

### Global Configuration

Configure global settings such as the default number of decimal places and rounding mode using:

```ts
FixedDecimal.configure({
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