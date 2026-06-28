# Error Handling

FixedPrecision throws descriptive `Error` objects for invalid inputs, domain errors, precision mismatches, and configuration issues.

## Value Errors

### Invalid value type

Thrown when a value is not a supported type.

```ts
new FixedPrecision(null);
// Error: Invalid value type: object

new FixedPrecision(undefined);
// Error: Invalid value type: undefined
```

**Accepted types:** `string`, `number`, `bigint`, or `FixedPrecision`.

### Invalid number

Thrown when `NaN`, `Infinity`, or `-Infinity` is passed as a number.

```ts
new FixedPrecision(NaN);
// Error: Invalid number: value must be a finite number.

new FixedPrecision(Infinity);
// Error: Invalid number: value must be a finite number.
```

## Configuration Errors

### Decimal places out of range

Places must be an integer between 0 and 20.

```ts
FixedPrecision.create({ places: -1 });
// Error: Decimal places must be an integer between 0 and 20

FixedPrecision.create({ places: 21 });
// Error: Decimal places must be an integer between 0 and 20

FixedPrecision.create({ places: 2.5 });
// Error: Decimal places must be an integer between 0 and 20
```

### Missing places in factory

Factories require `places` to be specified explicitly.

```ts
FixedPrecision.create({});
// Error: Decimal places must be specified in factory config

FixedPrecision.create({ roundingMode: 4 });
// Error: Decimal places must be specified in factory config
```

### Invalid rounding mode

Rounding mode must be an integer between 0 and 8.

```ts
FixedPrecision.create({ places: 2, roundingMode: 9 });
// Error: Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8

FixedPrecision.create({ places: 2, roundingMode: -1 });
// Error: Invalid rounding mode. Must be 0, 1, 2, 3, 4, 5, 6, 7 or 8
```

## Arithmetic Domain Errors

### Division by zero

```ts
const a = new FixedPrecision("10.00");
a.div(0);
// Error: Division by zero
```

### Square root of negative number

```ts
new FixedPrecision("-1.00").sqrt();
// Error: Square root of negative number
```

### Zero to negative power

```ts
new FixedPrecision("0").pow(-2);
// Error: 0 ** negative is undefined
```

### Non-integer exponent

```ts
new FixedPrecision("2.00").pow(2.5);
// Error: Exponent must be an integer
```

### Logarithm domain errors

```ts
new FixedPrecision("0").ln();
// Error: Logarithm is undefined for non-positive values

new FixedPrecision("-1").log();
// Error: Logarithm is undefined for non-positive values

new FixedPrecision("16").log(1);
// Error: Logarithm base must be positive and not equal to 1

new FixedPrecision("16").log(0);
// Error: Logarithm base must be positive and not equal to 1
```

### Factorial, permutations, combinations

Only defined for non-negative integers.

```ts
FixedPrecision.factorial(-1);
// Error: Factorial is only defined for non-negative integers

FixedPrecision.permutations(5, -1);
// Error: Permutations are only defined for non-negative integers

FixedPrecision.combinations(5, -1);
// Error: Combinations are only defined for non-negative integers
```

### Inverse hyperbolic functions (domain)

```ts
new FixedPrecision("0.5").acosh();
// Error: acosh is defined for values greater than or equal to 1

new FixedPrecision("2").atanh();
// Error: atanh is defined for values between -1 and 1

new FixedPrecision("-0.5").asech();
// Error: asech is defined for values greater than 0 and less than or equal to 1

new FixedPrecision("0").acoth();
// Error: Inverse hyperbolic cotangent is defined for values with abs > 1
```

## Precision Mismatch Errors

### Operating on different precisions

Thrown when arithmetic or comparison methods receive a `FixedPrecision` instance with a different `places` value.

```ts
const FP2 = FixedPrecision.create({ places: 2 });
const FP4 = FixedPrecision.create({ places: 4 });

const a = FP2("10.50");
const b = FP4("10.5000");

a.add(b);
// Error: Cannot operate on different precisions
```

**How to fix:** Convert one value's precision before operating:

```ts
a.add(FP2(b.toString())); // convert b to 2 places first
```

Raw operations (`plus`, `minus`, `times`, `ratio`, `rem`) and raw comparisons (`cmpRaw`, `eqRaw`, etc.) do **not** check precision — they operate on the raw bigint directly. Use those when you intentionally cross precisions.

## Clamp Errors

### min > max

```ts
const value = new FixedPrecision("50.00");
value.clamp(100, 0);
// Error: min must be less than or equal to max
```

## Rounding & Scale Errors

### Invalid scale range

```ts
new FixedPrecision("10.00").scale(21);
// Error: newScale must be an integer between 0 and 20
```

### Round dp exceeds context places

```ts
new FixedPrecision("10.00").round(10);
// Error: Decimal places (dp) must be between 0 and 8
```

### Zero increment

```ts
new FixedPrecision("10.00").toNearest(0);
// Error: Increment must be non-zero
```

### Negative shift amount

```ts
new FixedPrecision("10.00").shiftedBy(-1);
// Error: Shift amount must be a non-negative integer
```

### Invalid significant digits

```ts
new FixedPrecision("10.00").prec(0);
// Error: Precision must be a positive integer

new FixedPrecision("10.00").toPrecision(0);
// Error: Invalid precision
```

## Matrix Errors

### Vector length mismatch

```ts
FixedPrecision.dot([1, 2, 3], [4, 5]);
// Error: Vectors must have the same length
```

### Cross product dimension

```ts
FixedPrecision.cross([1, 2], [3, 4]);
// Error: Cross product is only defined for 3D vectors
```

## Fraction Errors

### Non-positive max denominator

```ts
new FixedPrecision("0.5").fraction(0);
// Error: maxDen must be a positive integer
```

## Error Handling Patterns

### Try-catch for user input

```ts
function parseAmount(input: string): FixedPrecision | null {
  try {
    return new FixedPrecision(input);
  } catch {
    return null;
  }
}
```

### Validate before creating a factory

```ts
function createFactory(places: number) {
  if (!Number.isInteger(places) || places < 0 || places > 20) {
    throw new Error("places must be 0-20");
  }
  return FixedPrecision.create({ places });
}
```

### Guard against precision mismatches

```ts
function safeAdd(a: FixedPrecision, b: FixedPrecision): FixedPrecision {
  if (a.places() !== b.places()) {
    throw new Error(`Precision mismatch: ${a.places()} vs ${b.places()}`);
  }
  return a.add(b);
}
```

## Next Steps

- [Basic Concepts](concepts.md) — understand the internal architecture
- [API Reference](api-reference.md) — complete method signatures
- [Testing Guide](testing.md) — testing strategies for edge cases
