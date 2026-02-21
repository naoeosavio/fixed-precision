# Performance Guide

This guide covers performance considerations and optimization techniques for FixedPrecision.

## Performance Characteristics

FixedPrecision is designed for accuracy and predictability, but understanding its performance characteristics can help you write efficient code.

### Operation Performance Ranking

From fastest to slowest:

1. **Comparison operations** (`eq`, `lt`, `gt`, etc.) - Direct bigint comparisons
2. **Raw operations** (`plus`, `minus`, `product`, etc.) - No scaling or validation
3. **Basic arithmetic** (`add`, `sub`) - Simple bigint arithmetic with scaling
4. **Multiplication** (`mul`) - Bigint multiplication with scaling adjustment
5. **Division** (`div`) - Bigint division with rounding
6. **Power** (`pow`) - Iterative multiplication
7. **Square root** (`sqrt`) - Iterative algorithm
8. **String conversion** (`toString`) - String manipulation
9. **Constructor/parsing** - String/number parsing and validation

## Optimization Techniques

### 1. Use Raw Operations for Performance-Critical Code

When you need maximum performance and can guarantee valid inputs, use raw operations:

```typescript
import FixedPrecision from "./FixedPrecision.js";

// Regular operations (slower, with validation)
const a = new FixedPrecision(10.5);
const b = new FixedPrecision(3.2);
const result1 = a.add(b); // Validates configs match

// Raw operations (faster, no validation)
const result2 = a.plus(b.value); // Direct bigint addition
```

**When to use raw operations:**
- In tight loops with known valid inputs
- When performing many consecutive operations
- When you've already validated inputs

**When to avoid raw operations:**
- With user-provided inputs
- When mixing different configurations
- When you need automatic scaling

### 2. Batch Operations

Group similar operations together to minimize object creation:

```typescript
// Inefficient: Creates intermediate objects
let total = new FixedPrecision(0);
for (const value of values) {
  total = total.add(value); // New object each iteration
}

// More efficient: Use raw operations in loop
let totalScaled = 0n;
const scale = 10n ** 8n; // 8 decimal places
for (const value of values) {
  totalScaled += BigInt(Math.round(value * 100000000));
}
const total = FixedPrecision.fromRaw(totalScaled);
```

### 3. Pre-calculate Constants

If you use the same values repeatedly, create them once:

```typescript
// Inefficient: Creates new objects each time
for (let i = 0; i < 1000; i++) {
  const tax = amount.mul(new FixedPrecision(0.08)); // New object each iteration
}

// Efficient: Create once, reuse
const TAX_RATE = new FixedPrecision(0.08);
for (let i = 0; i < 1000; i++) {
  const tax = amount.mul(TAX_RATE); // Reuses constant
}
```

### 4. Use Appropriate Precision

Higher precision means larger bigints and slower operations:

```typescript
// 20 decimal places (slower)
const highPrecision = FixedPrecision.create({ places: 20 });
const a = highPrecision(1.12345678901234567890);

// 2 decimal places (faster)
const lowPrecision = FixedPrecision.create({ places: 2 });
const b = lowPrecision(1.12);

// Operations with lower precision are faster
console.log(a.add(a).toString()); // Slower
console.log(b.add(b).toString()); // Faster
```

### 5. Avoid Unnecessary Conversions

Minimize conversions between types:

```typescript
// Inefficient: Multiple conversions
const calculate = (values: number[]) => {
  let result = new FixedPrecision(0);
  for (const num of values) {
    result = result.add(new FixedPrecision(num)); // Converts each number
  }
  return result.toNumber(); // Converts back
};

// More efficient: Work in one domain
const calculateEfficient = (values: FixedPrecision[]) => {
  let result = new FixedPrecision(0);
  for (const value of values) {
    result = result.add(value); // No conversion needed
  }
  return result;
};
```

## Performance Comparison

### Raw vs Regular Operations

```typescript
import FixedPrecision from "./FixedPrecision.js";

const a = new FixedPrecision(100.5);
const b = new FixedPrecision(50.25);

// Benchmark regular operations
console.time("regular");
for (let i = 0; i < 1000000; i++) {
  const result = a.add(b).sub(b).mul(b).div(b);
}
console.timeEnd("regular");

// Benchmark raw operations
console.time("raw");
const bScaled = b.value;
for (let i = 0; i < 1000000; i++) {
  const result = a.plus(bScaled).minus(bScaled).product(bScaled).fraction(bScaled);
}
console.timeEnd("raw");
```

**Expected results:** Raw operations are typically 2-3x faster than regular operations.

### Memory Usage

FixedPrecision objects have minimal memory overhead:
- Each instance stores: `bigint value`, `number places`, `number roundingMode`
- Approximately 32-48 bytes per instance (depending on bigint size)

```typescript
// Memory-efficient: Reuse objects
const processBatch = (values: FixedPrecision[]) => {
  let accumulator = new FixedPrecision(0);
  for (const value of values) {
    accumulator = accumulator.add(value);
  }
  return accumulator;
};

// Memory-intensive: Create many temporary objects
const processBatchInefficient = (values: number[]) => {
  return values.reduce((acc, num) => {
    return acc.add(new FixedPrecision(num)); // Creates new object each iteration
  }, new FixedPrecision(0));
};
```

## Real-World Performance Patterns

### Financial Calculations

```typescript
// Optimized portfolio calculation
const calculatePortfolioValue = (
  holdings: Array<{ shares: FixedPrecision; price: FixedPrecision }>
): FixedPrecision => {
  // Use raw operations for performance
  let totalScaled = 0n;
  
  for (const holding of holdings) {
    // Multiply scaled values directly
    const sharesScaled = holding.shares.value;
    const priceScaled = holding.price.value;
    const scale = 10n ** 16n; // Adjust for 8+8 decimal places
    
    totalScaled += (sharesScaled * priceScaled) / scale;
  }
  
  return FixedPrecision.fromRaw(totalScaled);
};
```

### Game Physics

```typescript
// Optimized game loop
class OptimizedGameObject {
  private positionScaled: bigint;
  private velocityScaled: bigint;
  private readonly scale: bigint;
  
  constructor(position: FixedPrecision, velocity: FixedPrecision) {
    this.scale = 10n ** BigInt(position["places"]);
    this.positionScaled = position.value;
    this.velocityScaled = velocity.value;
  }
  
  update(deltaTime: FixedPrecision): void {
    // Raw operations for performance
    const deltaScaled = deltaTime.value;
    const movement = (this.velocityScaled * deltaScaled) / this.scale;
    this.positionScaled += movement;
  }
  
  getPosition(): FixedPrecision {
    return FixedPrecision.fromRaw(this.positionScaled);
  }
}
```

## Benchmarking Your Code

Use the built-in benchmarking tools to measure performance:

```typescript
// Simple benchmarking utility
const benchmark = (name: string, iterations: number, fn: () => void) => {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const opsPerSec = (iterations / (end - start)) * 1000;
  console.log(`${name}: ${opsPerSec.toFixed(0)} ops/sec`);
};

// Benchmark different approaches
const values = Array.from({ length: 1000 }, (_, i) => new FixedPrecision(i * 0.01));

benchmark("Regular sum", 100, () => {
  let total = new FixedPrecision(0);
  for (const value of values) {
    total = total.add(value);
  }
});

benchmark("Raw sum", 100, () => {
  let totalScaled = 0n;
  for (const value of values) {
    totalScaled += value.value;
  }
  FixedPrecision.fromRaw(totalScaled);
});
```

## Common Performance Pitfalls

### 1. Creating Objects in Loops

```typescript
// ❌ Bad: Creates new FixedPrecision each iteration
for (let i = 0; i < 1000000; i++) {
  const result = new FixedPrecision(i).add(new FixedPrecision(0.01));
}

// ✅ Good: Create once, reuse
const increment = new FixedPrecision(0.01);
let current = new FixedPrecision(0);
for (let i = 0; i < 1000000; i++) {
  current = current.add(increment);
}
```

### 2. Unnecessary Precision

```typescript
// ❌ Bad: Using higher precision than needed
const highPrecision = FixedPrecision.create({ places: 20 });
const result = highPrecision(1.5).add(highPrecision(2.5)); // 20 decimal places

// ✅ Good: Use appropriate precision
const lowPrecision = FixedPrecision.create({ places: 2 });
const result = lowPrecision(1.5).add(lowPrecision(2.5)); // 2 decimal places
```

### 3. Frequent Type Conversions

```typescript
// ❌ Bad: Converting between types frequently
function processValue(num: number): number {
  const fixed = new FixedPrecision(num);
  const result = fixed.add(1).mul(2).div(3);
  return result.toNumber(); // Converts back
}

// ✅ Good: Stay in FixedPrecision domain
function processValueFixed(value: FixedPrecision): FixedPrecision {
  return value.add(1).mul(2).div(3); // No conversions
}
```

## When to Consider Alternatives

While FixedPrecision is optimized for most use cases, consider alternatives for:

1. **Extreme performance requirements**: Use raw bigint arithmetic directly
2. **Memory-constrained environments**: Consider using numbers with fixed multiplier
3. **Simple use cases**: JavaScript's `Number` may be sufficient with careful rounding

## Summary

- Use **raw operations** for performance-critical code
- **Batch operations** to minimize object creation
- **Choose appropriate precision** for your use case
- **Pre-calculate constants** that are reused
- **Benchmark** to identify bottlenecks
- **Avoid unnecessary conversions** between types

By following these guidelines, you can achieve both the precision of FixedPrecision and the performance needed for demanding applications.