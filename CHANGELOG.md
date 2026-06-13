# Changelog

All notable changes to the fixed-precision library will be documented in this file.

## [1.6.0] — 2026-06-12

### Fixes
- Use `Math.trunc` instead of `Math.floor` in `FixedPrecision.random` to align truncation semantics.

### Refactors
- Remove unused `fraction/raw.ts` module (including `plusRaw`, `minusRaw`, `productRaw`, `fractionRaw`, `leftoverRaw`).

### Performance
- **Trigonometry**: Cache `WorkContext` objects by scale to avoid redundant allocations and angle reduction; replace multiplications/divisions by powers of two with bitwise shifts across all trigonometric functions. (Speedups up to 32.36× in benchmarks)
- **Transcendental**: Cache `WorkContext` by scale for `log`, `log2`, `log10`, and `exp`; replace `*2n`/`/2n` with `<<1n`/`>>1n`; precompute `upperBound`. (Up to 13.7× speedup)
- **General**: Micro-optimizations across geometry, numeric, and statistics modules — replace power‑of‑two multiplications/divisions with bitwise shifts, and eliminate an unnecessary array allocation in `statistics/aggregate.ts` by switching from `slice` to an index‑based loop.

### Chores
- Remove empty file `src/expression/primitive.ts`.
- Bump version to 1.6.0.

## [1.5.0] — 2026-05-28

## Features

- Arithmetic and comparison method chaining: `add`, `sub`, `mul`, `div`, `mod`, `pow`, and comparison methods now accept raw numbers, strings, and bigints for fluent chaining.
- Raw operations (`plus`, `minus`, `product`, `fraction`, `leftover`) accept bigints and work across different precision contexts.
- Raw comparison methods (`cmpRaw`, `eqRaw`, `gtRaw`, `gteRaw`, `ltRaw`, `lteRaw`) for direct scaled-value comparison without coercion.
- Logical operations (`not`, `and`, `or`, `xor`) treat values numerically (zero as `false`, non-zero as `true`).
- Advanced arithmetic: `clamp`, `toNearest`, `hypot`, integer division (`idiv`).
- Trigonometric functions: `sin`, `cos`, `tan`, `sec`, `csc`, `cot`, `asin`, `acos`, `atan`, `atan2`, `acot`, `asec`, `acsc`, plus hyperbolic variants (`sinh`, `cosh`, `tanh`, etc.).
- Transcendental functions: `ln`, `log`, `log2`, `log10`, `exp`.
- Combinatorics: `factorial`, `permutations`, `combinations`.
- Sign and precision inspection: `sign()`, `isInteger()`, `places()`, `decimalPlaces()`, `precision()`, `sd()`, `isFixedPrecision()`.
- Data access and formatting: `num()` and `den()` for raw numerator/denominator, base conversion (`toBinary`, `toOctal`, `toHex`, `toHexadecimal`), `prec()` for significant-digit rounding, `toNumber()` with optional decimal places parameter.
- `scale()` now returns a new instance with the target decimal places, supporting both downscaling and upscaling.
- `sum()` static method to aggregate values (returns zero for empty input).
- `min()` and `max()` now accept array input.
- `FixedPrecision.create()` factory produces context-bound constructors with custom precision and rounding mode.
- `notEqualsValue` utility for inequality comparisons.
- `shiftedBy()` performs decimal shift.
- `dot()` and `cross()` vector product methods.
- Bitwise operations: `and`, `or`, `xor`, `not`, left and right shift.

## Fixes

- Fixed `pow()` exponentiation logic to correctly handle large exponents with BigInt.
- Corrected bigint constructor and `sqrt` calculations to properly account for scaling.
- Improved `toNumber()` accuracy for large values and reduced internal guard scale.
- Reverted `shiftedBy` to perform decimal shift instead of bitwise.
- Alias methods (`plus`, `minus`, `product`, `fraction`, `leftover`) now correctly enforce configuration validation.

## Performance

- Random generation now uses direct BigInt arithmetic, removing string conversion overhead.
- Instance creation optimized by reusing normalized instances when no scaling change is required.
- Rounding operations accelerated via precomputed power-of-ten lookup tables and fast paths.
- `pow()` optimized with specialized paths for exponents 0, 1, 2, and 3.
- `toString()` early return for zero decimal places for better performance.
- Number conversion and string formatting streamlined for improved throughput.

## Breaking Changes

- Removed `cube()` and `toFraction()` methods.
- Logical operations no longer accept boolean arguments; only numeric input is supported.
- `divToInt` renamed to `idiv`.
- Comparisons between different precision contexts now throw an error.
- Arithmetic operations now require all operands to share the same precision configuration.

## Documentation

- Added comprehensive documentation website: quick-start, core concepts, arithmetic guide, raw operations, bigint warnings, performance guide, API reference, and domain-specific examples (finance, gaming, scientific).
- Added precision factories guide.
- Updated README with detailed usage, examples, and method chaining documentation.

## [1.4.1] - 2026-05-17

### Changed
- Refactored `FixedPrecision.fromStringWithCtx()` into smaller helper paths for integer, short decimal, and long decimal parsing.
- Split `FixedPrecision.roundToScale()` into smaller rounding-mode helpers while preserving rounding behavior.

### Fixed
- Fixed `FixedPrecision.toString()` formatting for contexts configured with zero decimal places.

### Performance
- Improved `FixedPrecision.fromStringWithCtx()` parsing performance for string inputs.

## [1.4.0] - 2026-05-02

### Added
- **`FixedPrecision.min(val, ...vals)`** and **`FixedPrecision.max(val, ...vals)`** static methods
  - `Math.min`/`Math.max` style: variadic, static, normalizes all values to default context
  - Accepts both variadic arguments and a single array
  - Accepts strings, numbers, bigints, and `FixedPrecision` instances with different contexts
- **`FixedPrecision.sum(val, ...vals?)`** static method
  - Sums all values, accepting variadic arguments or a single array
  - Returns zero for empty array

### Changed
- Extracted shared `toScaled()` private static helper to unify value resolution logic
  - Used by both `constructor` and `toScaledValue()` to eliminate duplicated switching logic

## [1.3.0] - 2026-02-20

### Added
- **Comprehensive documentation** in `/docs/` directory:
  - `quick-start.md` - Getting started guide
  - `concepts.md` - Core concepts and architecture
  - `arithmetic.md` - Arithmetic operations guide
  - `raw-operations.md` - Raw operations without scaling
  - `bigint-warning.md` - Critical warning about bigint values being pre-scaled
  - `api-reference.md` - Complete API reference
  - `performance.md` - Performance optimization guide
  - `examples/finance.md` - Financial calculation examples
  - `examples/scientific.md` - Scientific calculation examples
  - `examples/gaming.md` - Game development examples

### Changed
- Updated README.md with link to comprehensive documentation
- Improved code organization and cleanup of optimization files

### Fixed
- Restored correct implementation of `toScaledValue()` method and raw operations
- Fixed LSP errors in test files

## [1.2.0] - 2026-02-20

### Added
- **PR #2: Methods should accept numbers, strings, and bigints**
  - All arithmetic methods (`add`, `sub`, `mul`, `div`, `mod`) now accept `FixedPrecisionValue`
  - All comparison methods (`cmp`, `eq`, `gt`, `gte`, `lt`, `lte`) now accept `FixedPrecisionValue`
  - Raw comparison methods (`cmpRaw`, `eqRaw`, `gtRaw`, `gteRaw`, `ltRaw`, `lteRaw`) for direct scaled value comparison
  - Method chaining support: `new FixedPrecision(10.5).add(5).div(3).toNumber()`
  - `toScaledValue()` method for converting values without configuration validation

### Changed
- Updated alias methods (`plus`, `minus`, `product`, `fraction`, `leftover`) to use consistent approach
- Improved `fromRaw()` method implementation

### Fixed
- Clarified that `plus`/`minus` are raw operations without scaling
- Fixed comparison behavior for mixed input types

## [1.1.0] - 2026-02-19

### Added
- **PR #3: Constructor configuration improvements**
  - Static `create()` factory method for configurable precision factories
  - Per-instance configuration support
  - Context-based configuration system with `FPContext` type
  - Precision validation in comparison methods

### Changed
- Refactored to use context-aware conversion methods
- Updated arithmetic methods to use `coerce()` for type safety
- Improved `toString()` logic and formatting
- Made `format` private and added getters for instance properties

### Fixed
- Type casting improvements
- Code structure and performance optimizations

## [1.0.8] - 2025-08-24

### Changed
- Updated constructor logic in FixedPrecision class
- Adjusted package-lock.json version

## [1.0.7] - 2025-08-24

### Performance Improvements
- **`pow()`**: Implemented exponentiation by squaring algorithm for integer exponents with direct bigint operations
- **`fromString()`**: Optimized string parsing logic by removing redundant checks and simplifying decimal handling

### Features
- Added `raw()` method to expose internal bigint value

### Bug Fixes
- Improved negative number handling in `fromString()`
- Fixed `sqrt()` precision by using format.places for iteration count

## [1.0.6] - 2025-05-18

### Features
- Added precomputed `POW10` array and `pow10Big()` method for optimization
- Complete reimplementation of `fromString()` with better decimal number handling
- Improved `fromNumber()` to handle numbers beyond safe integer range

### Improvements
- Replaced `Math.floor()` with `Math.trunc()` for better precision

## [1.0.5] - 2025-05-18

### Major Improvements
- Complete refactor of FixedPrecision class
- Performance optimizations in calculations
- Added mathematical constants (π, e, φ, √2)
- API improvements and method consistency

### Patch Changes
- Dependency updates
- Minor type system fixes

## [1.0.4] - 2025-05-18

### Release
- Initial public release preparation

## [1.0.3] - 2025-05-18

### Initial Release
- First published version of fixed-precision library
- Basic fixed-point decimal arithmetic operations
- Support for 0-20 decimal places
- 8 rounding modes
- TypeScript support with full type definitions

## Types of Changes

- **Added**: for new features
- **Changed**: for changes in existing functionality
- **Deprecated**: for soon-to-be removed features
- **Removed**: for now removed features
- **Fixed**: for any bug fixes
- **Security**: in case of vulnerabilities

[1.5.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/naoeosavio/fixed-precision/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.8...v1.1.0
[1.0.8]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/naoeosavio/fixed-precision/releases/tag/v1.0.3
