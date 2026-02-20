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

### Multiplication (`mul` / `product`)

```typescript
const price = new FixedPrecision("19.99");
const quantity = new FixedPrecision(3);

// Regular multiplication (with scaling)
const subtotal = price.mul(quantity); // "59.97000000"

// Raw multiplication (without scaling)
const rawProduct = price.product(quantity); // "5997000000.00000000"

// With percentage
const discount = new FixedPrecision("0.15"); // 15%
const discountAmount = subtotal.mul(discount); // "8.99550000"
```

### Division (`div` / `fraction`)

```typescript
const total = new FixedPrecision("100.00");
const people = new FixedPrecision(4);

// Regular division
const share = total.div(people); // "25.00000000"

// Raw division
const rawQuotient = total.fraction(people); // "0.25000000"

// Division by zero throws error
try {
  total.div(0);
} catch (error) {
  console.error(error.message); // "Division by zero"
}
```

### Modulo (`mod` / `leftover`)

```typescript
const amount = new FixedPrecision("10.50");
const divisor = new FixedPrecision("3.00");

// Regular modulo
const remainder = amount.mod(divisor); // "1.50000000"

// Raw modulo
const rawRemainder = amount.leftover(divisor); // "1.50000000"

// Useful for checking divisibility
const isDivisible = amount.mod(2).eq(0); // false (10.50 % 2 ≠ 0)
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

Raw operations (`plus`, `minus`, `product`, `fraction`, `leftover`) are faster but don't apply scaling:

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
a.product(b); // "246000000.00000000"
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