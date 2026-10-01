# Scientific Calculations with FixedPrecision

FixedPrecision is ideal for scientific calculations where predictable decimal precision is required.

## Basic Scientific Operations

```typescript
import FixedPrecision from "./FixedPrecision.js";

// Constants with high precision
const PI = FixedPrecision.PI();
const E = FixedPrecision.e();

// Scientific calculations
const circleArea = (radius: FixedPrecision) => {
  return PI.mul(radius).mul(radius);
};

const sphereVolume = (radius: FixedPrecision) => {
  return new FixedPrecision(4).div(3).mul(PI).mul(radius.pow(3));
};

// Example: Calculate circle area with 5cm radius
const radius = new FixedPrecision(5);
const area = circleArea(radius);
console.log(`Area: ${area.toString()} cm²`); // "78.53981634"

// Example: Exponential decay
const decayFormula = (initial: FixedPrecision, rate: FixedPrecision, time: FixedPrecision) => {
  return initial.mul(E.pow(rate.neg().mul(time)));
};

const initialAmount = new FixedPrecision(100);
const decayRate = new FixedPrecision(0.05); // 5% decay rate
const time = new FixedPrecision(10);
const remaining = decayFormula(initialAmount, decayRate, time);
console.log(`Remaining: ${remaining.toString()}`); // "60.65306597"
```

## Unit Conversions

```typescript
// Conversion factors with high precision
const METERS_TO_FEET = new FixedPrecision("3.280839895");
const KILOGRAMS_TO_POUNDS = new FixedPrecision("2.20462262185");
const CELSIUS_TO_FAHRENHEIT = (celsius: FixedPrecision) => {
  return celsius.mul(9).div(5).add(32);
};

// Precision conversions
const convertWithPrecision = (
  value: FixedPrecision,
  factor: FixedPrecision,
  targetPlaces: number
) => {
  const result = value.mul(factor);
  return result.withConfig({ places: targetPlaces });
};

// Example: Convert 100 meters to feet with 4 decimal places
const meters = new FixedPrecision(100);
const feet = convertWithPrecision(meters, METERS_TO_FEET, 4);
console.log(`${meters} meters = ${feet} feet`); // "100 meters = 328.0840 feet"
```

## Statistical Calculations

```typescript
// Calculate mean with fixed precision
const mean = (values: FixedPrecision[]): FixedPrecision => {
  if (values.length === 0) return new FixedPrecision(0);
  
  const sum = values.reduce((acc, val) => acc.add(val), new FixedPrecision(0));
  return sum.div(values.length);
};

// Calculate standard deviation
const standardDeviation = (values: FixedPrecision[]): FixedPrecision => {
  if (values.length < 2) return new FixedPrecision(0);
  
  const avg = mean(values);
  const squaredDiffs = values.map(val => val.sub(avg).pow(2));
  const variance = mean(squaredDiffs);
  return variance.sqrt();
};

// Example: Calculate statistics for measurements
const measurements = [
  new FixedPrecision("12.345"),
  new FixedPrecision("12.350"),
  new FixedPrecision("12.342"),
  new FixedPrecision("12.348"),
  new FixedPrecision("12.351"),
];

const avg = mean(measurements);
const stdDev = standardDeviation(measurements);

console.log(`Average: ${avg.toString()}`); // "12.3472"
console.log(`Standard Deviation: ${stdDev.toString()}`); // "0.0035"
```

## Error Propagation

```typescript
// Calculate propagated error for multiplication
const propagatedErrorMultiply = (
  value1: FixedPrecision,
  error1: FixedPrecision,
  value2: FixedPrecision,
  error2: FixedPrecision
): FixedPrecision => {
  // Relative errors
  const relError1 = error1.div(value1.abs());
  const relError2 = error2.div(value2.abs());
  
  // Combined relative error
  const combinedRelError = relError1.add(relError2);
  
  // Absolute error of product
  return value1.mul(value2).mul(combinedRelError);
};

// Example: Calculate area with error propagation
const length = new FixedPrecision("10.00");
const lengthError = new FixedPrecision("0.05"); // ±0.05 cm
const width = new FixedPrecision("5.00");
const widthError = new FixedPrecision("0.03"); // ±0.03 cm

const area = length.mul(width);
const areaError = propagatedErrorMultiply(length, lengthError, width, widthError);

console.log(`Area: ${area} ± ${areaError} cm²`); // "50.00 ± 0.40 cm²"
```

## Series Calculations

```typescript
// Calculate e^x using Taylor series
const expTaylor = (x: FixedPrecision, terms: number = 10): FixedPrecision => {
  let result = new FixedPrecision(1);
  let term = new FixedPrecision(1);
  let factorial = new FixedPrecision(1);
  
  for (let n = 1; n <= terms; n++) {
    factorial = factorial.mul(n);
    term = term.mul(x).div(n);
    result = result.add(term);
  }
  
  return result;
};

// Calculate sin(x) using Taylor series
const sinTaylor = (x: FixedPrecision, terms: number = 10): FixedPrecision => {
  let result = x;
  let term = x;
  let sign = -1;
  
  for (let n = 3; n <= terms * 2; n += 2) {
    term = term.mul(x).mul(x).div(n - 1).div(n).neg();
    result = result.add(term.mul(sign));
    sign = -sign;
  }
  
  return result;
};

// Example: Calculate e^0.5
const x = new FixedPrecision(0.5);
const expResult = expTaylor(x, 15);
console.log(`e^0.5 ≈ ${expResult.toString()}`); // "1.64872127"

// Compare with built-in Math.exp
console.log(`Math.exp(0.5) = ${Math.exp(0.5)}`); // 1.6487212707001282
```

## Best Practices for Scientific Calculations

1. **Choose Appropriate Precision**: Use higher precision (10-12 places) for scientific calculations
2. **Maintain Consistency**: Use the same precision throughout related calculations
3. **Error Analysis**: Always consider error propagation in measurements
4. **Unit Management**: Keep track of units alongside values
5. **Validation**: Validate inputs for scientific validity (positive values, realistic ranges)

```typescript
// Scientific calculation with validation
const calculateDensity = (
  mass: FixedPrecision,
  volume: FixedPrecision
): FixedPrecision => {
  // Validate inputs
  if (mass.lte(0)) {
    throw new Error("Mass must be positive");
  }
  if (volume.lte(0)) {
    throw new Error("Volume must be positive");
  }
  
  // Calculate with high precision
  return mass.div(volume).withConfig({ places: 10 });
};

// Example usage
const mass = new FixedPrecision("0.125"); // kg
const volume = new FixedPrecision("0.0001"); // m³
const density = calculateDensity(mass, volume);
console.log(`Density: ${density.toString()} kg/m³`); // "1250.00000000"
```

## Performance Considerations

For intensive scientific calculations:
- Use `withConfig()` to set appropriate precision once
- Consider using raw operations (`plus`, `minus`, etc.) for performance-critical sections
- Batch similar operations together
- Pre-calculate constants when possible