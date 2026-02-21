# Changelog

All notable changes to the fixed-precision library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.3.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.8...v1.1.0
[1.0.8]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/naoeosavio/fixed-precision/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/naoeosavio/fixed-precision/releases/tag/v1.0.3