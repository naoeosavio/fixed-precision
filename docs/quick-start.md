# Quick Start Guide

Get started with FixedPrecision in minutes with this quick start guide.

## Installation

```bash
npm install fixed-precision
```

## Basic Usage

```typescript
import FixedPrecision, { fixedconfig } from "fixed-precision";

// Optional: Configure global defaults
fixedconfig.configure({ places: 8, roundingMode: 4 });

// Create instances from various input types
const price = new FixedPrecision("19.99");
const quantity = new FixedPrecision(3);
const discount = new FixedPrecision(0.15); // 15% discount

// Calculate total with discount
const subtotal = price.mul(quantity);
const discountAmount = subtotal.mul(discount);
const total = subtotal.sub(discountAmount);

console.log("Subtotal:", subtotal.toString());    // "59.97000000"
console.log("Discount:", discountAmount.toString()); // "8.99550000"
console.log("Total:", total.toString());          // "50.97450000"
```

## Method Chaining

FixedPrecision supports method chaining with raw values:

```typescript
// Clean chaining without explicit instantiation
const result = new FixedPrecision(100)
  .add(50)          // Add 50
  .sub("25")        // Subtract 25
  .mul(2n)          // Multiply by 2 (bigint)
  .div(5);          // Divide by 5

console.log("Result:", result.toString()); // "50.00000000"
```

## Key Features Demonstrated

### 1. Multiple Input Types
```typescript
// All these create FixedPrecision instances
const a = new FixedPrecision("123.45");     // String
const b = new FixedPrecision(123.45);       // Number
const c = new FixedPrecision(12345000000n); // BigInt (pre-scaled!)
const d = new FixedPrecision(a);            // Another FixedPrecision
```

### 2. Arithmetic Operations
```typescript
const x = new FixedPrecision("10.5");
const y = new FixedPrecision("2.0");

const sum = x.add(y);        // 12.5
const difference = x.sub(y); // 8.5
const product = x.mul(y);    // 21.0
const quotient = x.div(y);   // 5.25
const remainder = x.mod(y);  // 0.5
```

### 3. Comparison Operations
```typescript
const accountBalance = new FixedPrecision("1000.00");
const purchaseAmount = new FixedPrecision("150.00");

if (accountBalance.gt(purchaseAmount)) {
  console.log("Sufficient funds");
}

if (purchaseAmount.eq(150)) {
  console.log("Purchase amount is exactly 150");
}
```

### 4. Rounding and Formatting
```typescript
const value = new FixedPrecision("123.456789");

console.log(value.toString());        // "123.45678900" (8 decimals)
console.log(value.round(2).toString()); // "123.46" (rounded to 2 decimals)
console.log(value.toNumber());        // 123.456789
```

## ⚠️ Important: BigInt Warning

**Critical:** BigInt values are treated as **pre-scaled**, not as decimal values:

```typescript
// WARNING: These are NOT equivalent!
new FixedPrecision("1.23").add(2);     // Adds 2.00000000
new FixedPrecision("1.23").add(2n);    // Adds 0.00000002 (not 2.00!)

// Correct usage of bigint (pre-scaled):
new FixedPrecision("1.23").add(200000000n); // Adds 2.00000000
```

## Next Steps

- Read [Basic Concepts](concepts.md) to understand the architecture
- Explore [Arithmetic Operations](arithmetic.md) for detailed examples
- Check [Common Patterns](examples/patterns.md) for real-world usage
- Review [Error Handling](errors.md) for troubleshooting