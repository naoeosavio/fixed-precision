# Raw Operations

Raw operations in FixedPrecision allow you to work directly with scaled values without automatic scaling adjustments. This provides flexibility for advanced use cases but requires understanding of the scaling system.

## Understanding Raw Operations

### Regular vs Raw Operations

**Regular operations** (with scaling):
- Apply scaling factor to maintain decimal precision
- Validate configuration between FixedPrecision instances
- Return results in the correct decimal format

**Raw operations** (without scaling):
- Operate directly on scaled integer values
- No configuration validation
- Return results as scaled values

```typescript
const a = new FixedPrecision("1.23");  // Internally: 123000000
const b = new FixedPrecision("2.00");  // Internally: 200000000

// Regular operation (with scaling)
a.mul(b);      // Returns "2.46000000"
// Calculation: (123000000 * 200000000) / 100000000 = 246000000

// Raw operation (without scaling)  
a.product(b);  // Returns "246000000.00000000"
// Calculation: 123000000 * 200000000 = 24600000000000000
```

## Raw Operation Methods

### `plus()` - Raw Addition
```typescript
const a = new FixedPrecision("1.23"); // 123000000
const b = new FixedPrecision("2.00"); // 200000000

const result = a.plus(b); // "3.23000000"
// Calculation: 123000000 + 200000000 = 323000000
```

### `minus()` - Raw Subtraction
```typescript
const a = new FixedPrecision("5.00"); // 500000000
const b = new FixedPrecision("2.50"); // 250000000

const result = a.minus(b); // "2.50000000"
// Calculation: 500000000 - 250000000 = 250000000
```

### `product()` - Raw Multiplication
```typescript
const a = new FixedPrecision("1.23"); // 123000000
const b = new FixedPrecision("2.00"); // 200000000

const result = a.product(b); // "246000000.00000000"
// Calculation: 123000000 * 200000000 = 24600000000000000
```

### `fraction()` - Raw Division
```typescript
const a = new FixedPrecision("10.00"); // 1000000000
const b = new FixedPrecision("2.00");  // 200000000

const result = a.fraction(b); // "5.00000000"
// Calculation: 1000000000 / 200000000 = 5
```

### `leftover()` - Raw Modulo
```typescript
const a = new FixedPrecision("10.50"); // 1050000000
const b = new FixedPrecision("3.00");  // 300000000

const result = a.leftover(b); // "1.50000000"
// Calculation: 1050000000 % 300000000 = 150000000
```

## When to Use Raw Operations

### 1. Working with Different Configurations
```typescript
const a = new FixedPrecision("1.23");      // 8 decimals: 123000000
const b = FixedPrecision.create({ places: 2 })("2.00"); // 2 decimals: 200

// Regular operation fails (different configurations)
// a.add(b); // Error: "Cannot operate on different precisions"

// Raw operation works
const result = a.plus(b); // "1.23000200"
// 123000000 + 200 = 123000200
```

### 2. Direct BigInt Operations
```typescript
const a = new FixedPrecision("1.23"); // 123000000

// Add pre-scaled bigint directly
const result = a.plus(200000000n); // "3.23000000"
// 123000000 + 200000000 = 323000000
```

### 3. Performance Optimization
```typescript
// For performance-critical loops
function sumArray(values: FixedPrecision[]): FixedPrecision {
  let total = new FixedPrecision(0);
  for (const value of values) {
    total = total.plus(value); // Raw addition is faster
  }
  return total;
}
```

### 4. Advanced Calculations
```typescript
// Calculate weighted average without intermediate scaling
function weightedAverage(values: FixedPrecision[], weights: FixedPrecision[]): FixedPrecision {
  let sumProducts = new FixedPrecision(0);
  let sumWeights = new FixedPrecision(0);
  
  for (let i = 0; i < values.length; i++) {
    sumProducts = sumProducts.plus(values[i].product(weights[i]));
    sumWeights = sumWeights.plus(weights[i]);
  }
  
  return sumProducts.fraction(sumWeights);
}
```

## Raw Comparisons

FixedPrecision also provides raw comparison methods:

### `cmpRaw()` - Raw Comparison
```typescript
const a = new FixedPrecision("1.23");      // 123000000
const b = FixedPrecision.create({ places: 2 })("2.00"); // 200

a.cmpRaw(b);  // 1 (123000000 > 200)
a.ltRaw(b);   // false
a.gtRaw(b);   // true
a.eqRaw(b);   // false
```

### Regular vs Raw Comparison Example
```typescript
const a = new FixedPrecision("1.23");      // 8 decimals
const b = FixedPrecision.create({ places: 2 })("2.00"); // 2 decimals

// Regular comparison: validates configuration
// a.lt(b); // Error: "Cannot operate on different precisions"

// Raw comparison: compares scaled values directly
a.ltRaw(b); // false (123000000 > 200)

// Mathematical truth: 1.23 < 2.00
// But raw comparison compares 123000000 vs 200
```

## Common Use Cases

### 1. Financial Calculations with Different Currencies
```typescript
// Different currencies might use different decimal places
const usd = new FixedPrecision("100.00");          // 2 decimals (USD)
const btc = FixedPrecision.create({ places: 8 })("0.001"); // 8 decimals (Bitcoin)

// Convert BTC to USD using raw operations
const btcPrice = new FixedPrecision("50000.00"); // USD per BTC
const usdValue = btc.product(btcPrice); // Raw multiplication
```

### 2. Scientific Calculations
```typescript
// Scientific calculations often need raw precision
const planckConstant = new FixedPrecision("6.62607015e-34");
const frequency = new FixedPrecision("5.0e14");

// Calculate photon energy: E = hν
const energy = planckConstant.product(frequency);
```

### 3. Game Development
```typescript
// Game physics might use different precisions for different systems
const position = FixedPrecision.create({ places: 4 })("123.4567"); // 4 decimals
const velocity = FixedPrecision.create({ places: 6 })("0.123456"); // 6 decimals

// Update position using raw operations
const newPosition = position.plus(velocity.product(deltaTime));
```

## ⚠️ Important Considerations

### 1. BigInt Values are Pre-scaled
```typescript
// WARNING: BigInt values are treated as pre-scaled!
const a = new FixedPrecision("1.23"); // 123000000

a.plus(2);     // Adds 2.00000000 (converts 2 to 200000000)
a.plus(2n);    // Adds 0.00000002 (treats 2n as pre-scaled: 2)
```

### 2. No Configuration Validation
```typescript
const a = FixedPrecision.create({ places: 8 })("1.00");
const b = FixedPrecision.create({ places: 2 })("2.00");

// Raw operations work, but result might not be what you expect
const result = a.plus(b); // "1.00000200" (not "3.00")
```

### 3. Result Interpretation
```typescript
const a = new FixedPrecision("1.23"); // 123000000
const b = new FixedPrecision("2.00"); // 200000000

const product = a.product(b); // "246000000.00000000"

// This represents 246000000 * 10^-8 = 2.46
// Not 246000000 (which would be the regular multiplication result)
```

## Best Practices

### 1. Use Regular Operations by Default
```typescript
// Default to regular operations for clarity and safety
const total = price.add(tax).sub(discount);
```

### 2. Document Raw Operation Usage
```typescript
// Always document why you're using raw operations
// Calculate using raw operations to avoid configuration validation
// when mixing different precision contexts
const result = value1.plus(value2); // Raw: different precisions
```

### 3. Validate Results
```typescript
function safeRawOperation(a: FixedPrecision, b: FixedPrecision): FixedPrecision {
  const result = a.plus(b);
  
  // Validate that the result makes sense
  if (result.abs().gt(new FixedPrecision("1000000.00"))) {
    throw new Error("Result unexpectedly large - check scaling");
  }
  
  return result;
}
```

### 4. Create Helper Functions
```typescript
function addWithDifferentPrecisions(a: FixedPrecision, b: FixedPrecision): FixedPrecision {
  // Convert both to same precision first
  const aScaled = a.scale(Math.max(a.ctx.places, b.ctx.places));
  const bScaled = b.scale(Math.max(a.ctx.places, b.ctx.places));
  
  // Then use regular addition
  return aScaled.add(bScaled);
}
```

## Performance Comparison

```typescript
// Benchmark example
const iterations = 1000000;
const values = Array.from({ length: iterations }, () => new FixedPrecision(Math.random()));

// Regular operations
console.time("regular");
let regularSum = new FixedPrecision(0);
for (const value of values) {
  regularSum = regularSum.add(value);
}
console.timeEnd("regular");

// Raw operations  
console.time("raw");
let rawSum = new FixedPrecision(0);
for (const value of values) {
  rawSum = rawSum.plus(value);
}
console.timeEnd("raw");
```

## Next Steps

- Review [Basic Concepts](concepts.md) to understand scaling
- Learn about [Precision Factories](factories.md) for context management
- Check [Performance Guide](performance.md) for optimization tips
- Explore [Common Patterns](examples/patterns.md) for real-world examples