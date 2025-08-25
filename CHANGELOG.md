# fixed-precision

## [1.0.7] - 2025-08-24

### Performance Improvements

- **pow()**: Implemented exponentiation by squaring algorithm for integer exponents with direct bigint operations
- **fromString()**: Optimized string parsing logic by removing redundant checks and simplifying decimal handling

### Features

- Added `raw()` method to expose internal bigint value

### Bug Fixes

- Improved negative number handling in `fromString()`
- Fixed sqrt() precision by using format.places for iteration count

## [1.0.6] - 2025-05-18

### Features

- Added precomputed `POW10` array and `pow10Big()` method for optimization
- Complete reimplementation of `fromString()` with better decimal number handling
- Improved `fromNumber()` to handle numbers beyond safe integer range

### Improvements

- Replaced `Math.floor()` with `Math.trunc()` for better precision

## 1.0.5

### Major Improvements

- Complete refactor of FixedPrecision class
- Performance optimizations in calculations
- Added mathematical constants (π, e, φ, √2)
- API improvements and method consistency

### Patch Changes

- Dependency updates
- Minor type system fixes

## 1.0.3

### Patch Changes

- update
