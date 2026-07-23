# Arithmetic Operations

FixedPrecision provides comprehensive arithmetic operations with exact decimal precision.

## Basic Arithmetic

### Addition (`add` / `plus`)

```typescript
const a = new FixedPrecision("10.50");
const b = new FixedPrecision("5.25");

// Regular addition (with scaling)
const sum = a.add(b); // "15.75000000"

// Raw addition (without scaling)
const rawSum = a.plus(b); // "15.75000000"

// Chaining with raw values
const chain = new FixedPrecision("10.00")
  .add(5)      // Add number
  .add("2.50") // Add string
  .add(1n);    // Add bigint (pre-scaled: 0.00000001)
```

### Subtraction (`sub` / `minus`)

```typescript
const balance = new FixedPrecision("1000.00");
const purchase = new FixedPrecision("149.99");

// Regular subtraction
const remaining = balance.sub(purchase); // "850.01000000"

// Raw subtraction
const rawDiff = balance.minus(purchase); // "850.01000000"

// Multiple subtractions
const total = new FixedPrecision("100.00")
  .sub(10)      // Subtract 10.00
  .sub("5.50")  // Subtract 5.50
  .sub(2n);     // Subtract 0.00000002
```

### Multiplication (`mul` / `times`)

```typescript
const price = new FixedPrecision("19.99");
const quantity = new FixedPrecision(3);

// Regular multiplication (with scaling)
const subtotal = price.mul(quantity); // "59.97000000"

// Raw multiplication (without scaling)
const rawTimes = price.times(quantity); // "5997000000.00000000"

// With percentage
const discount = new FixedPrecision("0.15"); // 15%
const discountAmount = subtotal.mul(discount); // "8.99550000"
```

### Division (`div` / `ratio`)

```typescript
const total = new FixedPrecision("100.00");
const people = new FixedPrecision(4);

// Regular division
const share = total.div(people); // "25.00000000"

// Raw division
const rawQuotient = total.ratio(people); // "0.25000000"

// Division by zero throws error
try {
  total.div(0);
} catch (error) {
  console.error(error.message); // "Division by zero"
}
```

### Modulo and Remainder (`mod`, `rem`, `divmod`, `idivmod`, `rest`)

FixedPrecision provides five operations for division decomposition. With **SCALE = 100\_000\_000** (8 decimal places) and values `a = 12.34`, `b = 5.67`:

```typescript
a raw:   1234000000n  = 12.34 × SCALE
b raw:    567000000n  = 5.67  × SCALE
```

#### How Each Operation Works

##### `mod` — Scaled Modulo

```typescript
mod = (a.value × SCALE) % b.value
mod = (1234000000 × 100000000) % 567000000
mod = 172000000n  →  1.72000000
```

The dividend is multiplied by SCALE before the modulo, providing extra precision. The result retains SCALE precision: it represents the remainder of an enhanced-precision division. Useful when you need the remainder with full decimal fidelity — e.g. checking if a high-precision amount is divisible.

##### `rem` — Raw Remainder

```typescript
rem = a.value % b.value
rem = 1234000000 % 567000000
rem = 100000000n  →  1.00000000
```

Plain bigint modulo on the scaled values. This is equivalent to `(a % b) × SCALE`. Use it when you only care about the integer-level remainder — e.g. "how many units are left after grouping."

##### `divmod` — Quotient + Exact Remainder

```typescript
quotient = (a.value × SCALE) / b.value
         = 1234000000 × 100000000 / 567000000
         = 217636684n  →  2.17636684

remainder = a.value - (quotient × b.value) / SCALE
          = 1234000000 - (217636684 × 567000000) / 100000000
          = 1234000000 - 1233999998
          = 2n  →  0.00000002
```

Returns both the quotient (same as `div()`) and the **exact remainder** after full-precision division — the amount "rest" that cannot be expressed at the current scale. This is always the smallest non-negative residual that, when added back, reconstructs the original dividend:
`a = quotient × b + remainder / SCALE`.

##### `rest` — Divmod Remainder Alias

```typescript
a.rest(b) === a.divmod(b).remainder
```

Convenience method that returns only the exact remainder from the internal division, without the quotient.

##### `idivmod` — Integer Quotient + Remainder

```typescript
quotient = (a.value / b.value) * SCALE
         = (1234000000 / 567000000) * 100000000
         = 2 * 100000000
         = 200000000n  →  2.00000000

remainder = a.value - (quotient * b.value) / SCALE
           = 1234000000 - (200000000 * 567000000) / 100000000
           = 1234000000 - 1134000000
           = 100000000n  →  1.00000000
```

Returns both the **integer quotient** (using truncated bigint division) and the corresponding remainder. This differs from `divmod` in that the quotient is always an integer multiple of SCALE — equivalent to `idiv` for the quotient — and the remainder is what's left after subtracting that integer multiple of the divisor.

The relationship `a = quotient × b + remainder / SCALE` still holds:
`2.00 × 5.67 = 11.34`, plus `1.00` remainder = `12.34`.

#### Comparison Table (12.34 / 5.67)

| Method | Raw Bigint | Decimal | Meaning |
|--------|-----------|---------|---------|
| `mod` | `172000000n` | `1.72000000` | Scaled remainder (extra precision) |
| `rem` | `100000000n` | `1.00000000` | Raw integer remainder |
| `idivmod().quotient` | `200000000n` | `2.00000000` | Integer quotient (truncated) |
| `idivmod().remainder` | `100000000n` | `1.00000000` | Remainder after integer division |
| `divmod().remainder` / `rest` | `2n` | `0.00000002` | Exact residual after full-precision division |

#### Usage Examples

```typescript
const a = FP8("12.34");
const b = FP8("5.67");

a.mod(b).toString();            // "1.72000000"
a.rem(b).toString();            // "1.00000000"
a.rest(b).toString();           // "0.00000002"
a.idivmod(b).quotient.toString();  // "2.00000000"
a.idivmod(b).remainder.toString(); // "1.00000000"
a.divmod(b).quotient.toString();   // "2.17636684"
a.divmod(b).remainder.toString();  // "0.00000002"

// Accepts numbers and strings through coercion
a.rest(5.67);      // "0.00000002"
a.rest("5.67");    // "0.00000002"

// Checking divisibility
const isDivisible = a.mod(2).eq(0); // false
```

## Advanced Arithmetic

### Exponentiation (`pow`)

```typescript
const base = new FixedPrecision("2.00");

// Positive exponent
const squared = base.pow(2); // "4.00000000"
const cubed = base.pow(3);   // "8.00000000"

// Negative exponent (reciprocal)
const reciprocal = base.pow(-1); // "0.50000000"

// Only integer exponents are supported
try {
  base.pow(2.5);
} catch (error) {
  console.error(error.message); // "Exponent must be an integer"
}
```

### Square Root (`sqrt`)

```typescript
const value = new FixedPrecision("16.00");

const root = value.sqrt(); // "4.00000000"

// Negative numbers throw error
try {
  new FixedPrecision("-1.00").sqrt();
} catch (error) {
  console.error(error.message); // "Cannot compute square root of negative number"
}
```

### Negation (`neg`)

```typescript
const positive = new FixedPrecision("100.00");
const negative = positive.neg(); // "-100.00000000"

// Double negation returns original
const backToPositive = negative.neg(); // "100.00000000"
```

### Minimum and Maximum (`min` / `max`)

Static methods that work like `Math.min()` and `Math.max()` for fixed-precision values.
All values are normalized to the default context before comparison.

```typescript
// Variadic arguments
FixedPrecision.min("5.0", "3.0", "7.0", "1.0"); // "1.00000000"
FixedPrecision.max(2, 1, 4, 3);                  // "4.00000000"

// Array form
FixedPrecision.min([2, 1, 4, 3]);      // "1.00000000"
FixedPrecision.max(["5.0", "3.0"]);    // "5.00000000"

// Mixed types and FixedPrecision instances
const a = new FixedPrecision("100.5");
FixedPrecision.min(a, "50.25", 3.0); // "3.00000000"

// Values from different precision factories are normalized
const FP4 = FixedPrecision.create({ places: 4 });
const b = FP4("10.50");
FixedPrecision.max(b, "5.0"); // "10.50000000" (default 8 places)
```

### Sum (`sum`)

Adds all given values together. Accepts variadic arguments or an array.
Empty input returns zero.

```typescript
// Variadic
FixedPrecision.sum(1, 2, 3, 4);       // "10.00000000"
FixedPrecision.sum("2.5", "3.5");      // "6.00000000"

// Array
FixedPrecision.sum([10, 20, 30]);      // "60.00000000"

// Empty
FixedPrecision.sum([]); // "0.00000000"
```



## Chaining Operations

FixedPrecision supports fluent method chaining:

```typescript
// Complex calculation in a single chain
const result = new FixedPrecision(1000)
  .add(500)                 // 1500.00
  .sub("250")               // 1250.00  
  .mul(2)                   // 2500.00
  .div(5)                   // 500.00
  .mod(3)                   // 2.00
  .pow(2)                   // 4.00
  .sqrt();                  // 2.00

console.log(result.toString()); // "2.00000000"
```

## Mixed Input Types

All arithmetic methods accept `FixedPrecisionValue`:

```typescript
const calculation = new FixedPrecision("100.00")
  .add(50)          // number
  .add("25.50")     // string
  .add(100000000n)  // bigint (1.00 with 8 decimals)
  .sub(new FixedPrecision("10.00")); // FixedPrecision instance
```

## Performance Considerations

### When to Use Raw Operations

Raw operations (`plus`, `minus`, `times`, `ratio`, `rem`) are faster but don't apply scaling:

```typescript
// Use raw operations when:
// 1. Working with pre-scaled values
// 2. Performance is critical
// 3. You understand the scaling implications

const a = new FixedPrecision("1.23"); // 123000000
const b = new FixedPrecision("2.00"); // 200000000

// Regular (with scaling): (123000000 * 200000000) / 100000000 = 246000000
a.mul(b); // "2.46000000"

// Raw (without scaling): 123000000 * 200000000 = 24600000000000000  
a.times(b); // "246000000.00000000"
```

### Avoiding Unnecessary Conversions

```typescript
// Less efficient: multiple conversions
const result1 = new FixedPrecision("10.00")
  .add("5.00")
  .add("3.00")
  .add("2.00");

// More efficient: single conversion
const result2 = new FixedPrecision("10.00")
  .add(new FixedPrecision("5.00"))
  .add(new FixedPrecision("3.00"))
  .add(new FixedPrecision("2.00"));
```

## Common Patterns

### Financial Calculations

```typescript
function calculateTotal(price: FixedPrecision, quantity: number, taxRate: FixedPrecision): FixedPrecision {
  const subtotal = price.mul(quantity);
  const tax = subtotal.mul(taxRate);
  return subtotal.add(tax);
}

const price = new FixedPrecision("19.99");
const taxRate = new FixedPrecision("0.08"); // 8%
const total = calculateTotal(price, 3, taxRate); // "64.76760000"
```

### Percentage Calculations

```typescript
function applyDiscount(amount: FixedPrecision, discountPercent: FixedPrecision): FixedPrecision {
  const discount = amount.mul(discountPercent.div(100));
  return amount.sub(discount);
}

const original = new FixedPrecision("100.00");
const discounted = applyDiscount(original, new FixedPrecision("15")); // "85.00000000"
```

### Unit Conversions

```typescript
function convertCurrency(amount: FixedPrecision, exchangeRate: FixedPrecision): FixedPrecision {
  return amount.mul(exchangeRate);
}

const usd = new FixedPrecision("100.00");
const eurRate = new FixedPrecision("0.85");
const eur = convertCurrency(usd, eurRate); // "85.00000000"
```

## Error Handling

```typescript
try {
  const result = new FixedPrecision("10.00").div("0.00");
} catch (error) {
  if (error.message === "Division by zero") {
    console.error("Cannot divide by zero");
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Next Steps

- Learn about [Comparison Methods](comparison.md)
- Understand [Rounding & Scaling](rounding-scaling.md)
- Explore [Raw Operations](raw-operations.md) in depth
- Check [Common Patterns](examples/patterns.md) for more examples