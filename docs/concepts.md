# Basic Concepts

Understanding the core concepts behind FixedPrecision will help you use the library effectively.

## Scaled Representation

FixedPrecision uses a **scaled integer representation** internally. Instead of storing decimal values as floating-point numbers, it stores them as integers multiplied by a scale factor.

### How Scaling Works

```typescript
// With 8 decimal places (default):
const value = new FixedPrecision("1.23");
// Internally stored as: 123000000
// Scale factor: 10^8 = 100,000,000
// Calculation: 1.23 * 100,000,000 = 123,000,000
```

### Scale Factors by Decimal Places

| Decimal Places | Scale Factor | Example: "1.23" stored as |
|----------------|--------------|---------------------------|
| 0 | 10^0 = 1 | 1 |
| 2 | 10^2 = 100 | 123 |
| 4 | 10^4 = 10,000 | 12300 |
| 8 (default) | 10^8 = 100,000,000 | 123000000 |
| 20 (max) | 10^20 | 12300000000000000000000 |

## Precision Context

Each FixedPrecision instance has a **precision context** that defines:
- **Places**: Number of decimal places (0-20)
- **Rounding Mode**: How to handle rounding operations

### Default Context
By default, FixedPrecision uses:
- 8 decimal places
- ROUND_HALF_UP rounding (mode 4)

### Context Isolation
```typescript
// Create isolated contexts with factories
const FP8 = FixedPrecision.create({ places: 8 });
const FP2 = FixedPrecision.create({ places: 2 });

const a = FP8("1.23456789"); // "1.23456789"
const b = FP2("1.23");       // "1.23"

// Mixing contexts throws an error for safety
// a.add(b) // Error: Cannot operate on different precisions
```

## Type System

### FixedPrecisionValue Type
All arithmetic and comparison methods accept `FixedPrecisionValue`:

```typescript
type FixedPrecisionValue = string | number | bigint | FixedPrecision;
```

### Type Conversion Rules

| Input Type | Behavior |
|------------|----------|
| `string` | Parsed as decimal string, scaled to current context |
| `number` | Converted from JavaScript number, scaled to current context |
| `bigint` | **Treated as pre-scaled value** (already multiplied by scale factor) |
| `FixedPrecision` | Used directly with configuration validation |

### Important: BigInt is Pre-scaled
This is a critical distinction:
```typescript
// These are NOT equivalent:
new FixedPrecision(123);       // 123.00000000 (decimal value)
new FixedPrecision(123n);      // 0.00000123 (pre-scaled value)

// To create 123.00 with bigint:
const scale = 10n ** 8n;       // 100,000,000
new FixedPrecision(123n * scale); // 123.00000000
```

## Operations with vs without Scaling

FixedPrecision provides two sets of operations:

### With Scaling (Regular Operations)
- `add()`, `sub()`, `mul()`, `div()`, `mod()`
- Apply scaling factor to maintain correct decimal precision
- Validate configuration when operating with other FixedPrecision instances

### Without Scaling (Raw Operations)
- `plus()`, `minus()`, `product()`, `fraction()`, `leftover()`
- Operate directly on scaled values
- No configuration validation
- Useful for advanced calculations and performance optimization

```typescript
const a = new FixedPrecision("1.23");  // 123000000
const b = new FixedPrecision("2.00");  // 200000000

a.mul(b);      // Returns 2.46 (with scaling)
a.product(b);  // Returns 24600000000000000 (without scaling)
```

## Immutability

FixedPrecision instances are **immutable**. Operations return new instances:

```typescript
const a = new FixedPrecision("10.00");
const b = a.add("5.00");  // Returns new instance

console.log(a.toString()); // "10.00000000" (unchanged)
console.log(b.toString()); // "15.00000000" (new instance)
```

## Error Handling

FixedPrecision throws descriptive errors for:
- Invalid input values
- Division by zero
- Configuration mismatches
- Overflow/underflow conditions
- Invalid rounding modes

```typescript
try {
  const result = new FixedPrecision("10.00").div("0.00");
} catch (error) {
  console.error(error.message); // "Division by zero"
}
```

## Performance Considerations

### Advantages
- **Exact precision**: No floating-point rounding errors
- **Predictable performance**: Integer operations are consistent
- **Memory efficient**: BigInt storage is compact

### Considerations
- **BigInt operations**: Can be slower than Number for very large values
- **Conversion overhead**: String/number parsing has some cost
- **Context validation**: Adds overhead but ensures correctness

## Next Steps

- Learn about [Arithmetic Operations](arithmetic.md)
- Understand [Raw Operations](raw-operations.md) for advanced use cases
- Explore [Precision Factories](factories.md) for context management
- Check [Performance Guide](performance.md) for optimization tips