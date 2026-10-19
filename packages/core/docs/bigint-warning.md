# ⚠️ Critical: BigInt Values are Pre-scaled

**This is the most important concept to understand when using FixedPrecision with BigInt values.**

## The Critical Distinction

When you pass a `bigint` value to FixedPrecision, it is treated as **already scaled** (pre-scaled), **not** as a decimal value. This is fundamentally different from how `number` and `string` inputs are handled.

```typescript
// WARNING: These are NOT equivalent!
new FixedPrecision(123);       // Creates 123.00000000 (decimal value)
new FixedPrecision("123");     // Creates 123.00000000 (decimal value)
new FixedPrecision(123n);      // Creates 0.00000123 (pre-scaled value!)
```

## Understanding the Difference

### How Scaling Works

With 8 decimal places (default):
- Scale factor = 10^8 = 100,000,000
- Decimal value × scale factor = scaled value

```typescript
// Decimal "1.23" becomes scaled 123,000,000
// Calculation: 1.23 × 100,000,000 = 123,000,000
const decimalValue = new FixedPrecision("1.23");
// Internally stored as: 123000000n
```

### BigInt Input Behavior

When you provide a `bigint`, FixedPrecision assumes it's **already scaled**:

```typescript
// Providing 123n as bigint
const fromBigInt = new FixedPrecision(123n);
// Internally stored as: 123n (no scaling applied)
// Decimal value: 123 ÷ 100,000,000 = 0.00000123
```

## Common Mistakes and Solutions

### Mistake 1: Using Small BigInt Values

```typescript
// ❌ WRONG: Common mistake
const wrong = new FixedPrecision("1.23").add(2n);
// Adds 0.00000002, not 2.00!
// Result: 1.23000002 (not 3.23!)

// ✅ CORRECT: Use number or string
const correct1 = new FixedPrecision("1.23").add(2);
// Adds 2.00000000
// Result: 3.23000000

// ✅ CORRECT: Use pre-scaled bigint
const scale = 10n ** 8n; // 100,000,000
const correct2 = new FixedPrecision("1.23").add(2n * scale);
// Adds 2.00000000
// Result: 3.23000000
```

### Mistake 2: Creating Instances with BigInt

```typescript
// ❌ WRONG: Creates tiny value
const tinyValue = new FixedPrecision(100n); // 0.00000100

// ✅ CORRECT: Use number or string
const decimalValue = new FixedPrecision(100); // 100.00000000

// ✅ CORRECT: Scale the bigint first
const scale = 10n ** 8n;
const scaledValue = new FixedPrecision(100n * scale); // 100.00000000
```

### Mistake 3: Mixing BigInt with Other Types

```typescript
const price = new FixedPrecision("19.99");
const quantity = 3;

// ❌ WRONG: Using bigint for quantity
const wrongTotal = price.mul(3n); // Multiplies by 0.00000003!

// ✅ CORRECT: Use number
const correctTotal = price.mul(3); // Multiplies by 3.00
```

## When to Use BigInt

### Appropriate Use Cases

1. **Working with Pre-scaled Values**
   ```typescript
   // When you already have scaled values from other FixedPrecision instances
   const a = new FixedPrecision("1.23");
   const b = new FixedPrecision("2.00");
   
   // Get scaled values
   const scaledA = a.value; // 123000000n
   const scaledB = b.value; // 200000000n
   
   // Use raw operations with pre-scaled bigints
   const result = new FixedPrecision(0).plus(scaledA).plus(scaledB);
   ```

2. **Performance-Critical Operations**
   ```typescript
   // In tight loops where conversion overhead matters
   function sumScaledValues(scaledValues: bigint[]): FixedPrecision {
     let total = 0n;
     for (const value of scaledValues) {
       total += value;
     }
     return new FixedPrecision(total);
   }
   ```

3. **External Data in Scaled Format**
   ```typescript
   // When receiving data already in scaled format from APIs or databases
   function fromDatabase(scaledValue: bigint): FixedPrecision {
     return new FixedPrecision(scaledValue);
   }
   ```

### Inappropriate Use Cases

1. **Literal Decimal Values**
   ```typescript
   // ❌ Don't use bigint for literals
   new FixedPrecision(100n); // Wrong: 0.00000100
   
   // ✅ Use number or string
   new FixedPrecision(100);   // Correct: 100.00000000
   new FixedPrecision("100"); // Correct: 100.00000000
   ```

2. **User Input**
   ```typescript
   // ❌ Don't convert user input to bigint
   const userInput = "100.50";
   new FixedPrecision(BigInt(userInput)); // Wrong: 100n = 0.00000100
   
   // ✅ Pass string directly
   new FixedPrecision(userInput); // Correct: 100.50000000
   ```

3. **Calculations with Decimal Values**
   ```typescript
   // ❌ Don't use bigint for decimal calculations
   const result = price.mul(quantityAsBigInt);
   
   // ✅ Use number or FixedPrecision
   const result = price.mul(quantity);
   ```

## Conversion Utilities

### Converting Decimal to Scaled BigInt

```typescript
function decimalToScaledBigInt(decimalValue: number | string, decimalPlaces: number = 8): bigint {
  const scale = 10n ** BigInt(decimalPlaces);
  const fixed = new FixedPrecision(decimalValue);
  return fixed.value; // Returns scaled bigint
}

// Usage
const scaled = decimalToScaledBigInt("123.45", 8); // 12345000000n
```

### Converting Scaled BigInt to Decimal

```typescript
function scaledBigIntToDecimal(scaledValue: bigint, decimalPlaces: number = 8): FixedPrecision {
  return new FixedPrecision(scaledValue); // Assumes pre-scaled
}

// Usage
const decimal = scaledBigIntToDecimal(12345000000n, 8); // "123.45000000"
```

## Best Practices

### 1. Default to Number/String for Literals

```typescript
// ✅ Good: Clear and safe
const price = new FixedPrecision("19.99");
const quantity = new FixedPrecision(3);
const discount = new FixedPrecision(0.15);
```

### 2. Document BigInt Usage

```typescript
// Always document when using bigint
const scaledValue = 12345000000n; // Pre-scaled: represents 123.45 with 8 decimals
const fixedValue = new FixedPrecision(scaledValue);
```

### 3. Use Helper Functions

```typescript
// Create helper functions for common conversions
function createFromDecimal(value: number | string): FixedPrecision {
  return new FixedPrecision(value); // Uses number/string constructor
}

function createFromScaled(value: bigint): FixedPrecision {
  return new FixedPrecision(value); // Uses bigint constructor
}
```

### 4. Validate Input Types

```typescript
function safeCreate(value: FixedPrecisionValue): FixedPrecision {
  if (typeof value === "bigint") {
    console.warn("Warning: bigint values are treated as pre-scaled");
  }
  return new FixedPrecision(value);
}
```

## Examples of Correct Usage

### Example 1: Financial Application

```typescript
// ❌ Wrong: Using bigint for monetary values
const wrongPrice = new FixedPrecision(1999n); // 0.00001999 (not $19.99!)

// ✅ Correct: Using string for monetary values
const correctPrice = new FixedPrecision("19.99"); // $19.99

// Calculations
const quantity = 3;
const total = correctPrice.mul(quantity); // $59.97
```

### Example 2: Performance Optimization

```typescript
// Pre-scale values once
const scaledPrices = prices.map(p => p.value); // Extract scaled bigints

// Fast summation using raw operations
let totalScaled = 0n;
for (const scaledPrice of scaledPrices) {
  totalScaled += scaledPrice;
}

// Convert back to FixedPrecision
const total = new FixedPrecision(totalScaled);
```

### Example 3: API Integration

```typescript
// API returns scaled values (common in financial systems)
interface ApiResponse {
  amount: bigint; // Pre-scaled: 12345000000 = 123.45
  decimals: number; // 8
}

function fromApiResponse(response: ApiResponse): FixedPrecision {
  // Bigint is pre-scaled, so use directly
  return new FixedPrecision(response.amount);
}
```

## Testing for BigInt Issues

### Test Helper

```typescript
function testBigIntUsage() {
  const testCases = [
    { input: 100n, expected: "0.00000100", description: "bigint 100n" },
    { input: 100, expected: "100.00000000", description: "number 100" },
    { input: "100", expected: "100.00000000", description: "string '100'" },
  ];
  
  for (const testCase of testCases) {
    const result = new FixedPrecision(testCase.input).toString();
    if (result !== testCase.expected) {
      console.error(`FAIL: ${testCase.description}`);
      console.error(`  Expected: ${testCase.expected}`);
      console.error(`  Got: ${result}`);
    }
  }
}
```

### Debugging Tool

```typescript
function debugValue(value: FixedPrecisionValue): void {
  const fixed = new FixedPrecision(value);
  console.log(`Input: ${value} (${typeof value})`);
  console.log(`Internal: ${fixed.value}n`);
  console.log(`Decimal: ${fixed.toString()}`);
  console.log(`Scale: 10^${fixed.ctx.places}`);
  console.log("---");
}

// Usage
debugValue(123n);     // Shows: 0.00000123
debugValue(123);      // Shows: 123.00000000
debugValue("123");    // Shows: 123.00000000
```

## Summary

**Key Rule:** `bigint` values are **pre-scaled**, `number` and `string` values are **decimal**.

**When to use bigint:**
- Working with already scaled values
- Performance-critical operations
- External data in scaled format

**When to avoid bigint:**
- Literal decimal values
- User input
- General calculations

**Always remember:** `123n` ≠ `123.00`, but `0.00000123`!