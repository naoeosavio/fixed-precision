# Numeric Precision Guide

Real-world accuracy delivered by each operation class, measured against 45-digit
references (Python `Decimal`). "ULP" here means 1 unit in the last decimal place
(`10^-places`).

## Trigonometry (`sin`, `cos`, `tan`, `cot`, `sec`, `csc`)

| Scenario | Accuracy |
| --- | --- |
| Generic angles (e.g. `sin(0.5)`, `cos(100)`, `tan(1)`) at places 7/16/18 | <= 2 ULPs |
| Large angles (`sin(10^6)`, `sin(12345.6789)`) | <= 2 ULPs |
| Special angles (45°, 60°, 90°, ...) | exact (`1`, `2`, `0`, ...) or <= 2 ULPs |
| `sin`/`cos` at multiples of π (reflex quadrants) | <= 3 ULPs |
| `tan`/`cot`/`sec`/`csc` at multiples of π (reflex quadrants) | <= 15 ULPs |

The reciprocal-family spread in reflex quadrants comes from the truncation of π
itself (the library stores π with `places + guard` digits) amplified by
`sec²`/`csc²` (up to ~15x at 15°/75°). This is inherent to the fixed-precision
representation, not an algorithmic error.

Notes:

- Singularities (`tan`/`sec` at π/2, `cot`/`csc` at 0 and π) throw when the
  reduced angle is within 1 ULP of the truncated π/2 (or π).
- Just outside that tolerance, `tan` near π/2 returns large finite values that
  converge to the expected magnitude as the distance grows (±1..10 ULPs away).
- Internally, angles are reduced with an extended-π constant
  (`2 × places` digits), so reduction itself does not lose digits even for very
  large inputs.

## Hyperbolic (`sinh`, `tanh`)

- For `|x| <= 10^-6`, `sinh` and `tanh` use a Taylor series instead of
  `(eˣ − e⁻ˣ)/2`, avoiding catastrophic cancellation:
  - `tanh(1 ULP)` returns `1 ULP` (previously returned `0`).
  - `sinh(1e-9)` returns exactly `1e-9` with sign preserved.
- For larger `|x|` the exponential formula is unchanged.

## Inverse functions

`asin`, `acos` use `atan2` with `sqrt(1 − x²)` computed as `(1 − x)(1 + x)`,
which avoids cancellation near `x = ±1` (e.g. `acos(1 − 1 ULP)` stays accurate).

## Performance (after optimizations)

Measured at places 20 (`atan_value` core operation):

- `atan_value`: 19.5µs → ~7µs (sqrt seeding + single-division series).
- `sin_value`: ~3.6µs.
- `sqrt` on 1000-digit values: milliseconds → microseconds (Newton seeded by
  bit-length instead of `target >> 1n`).

## Test coverage

Precision guarantees are locked by `test/trig-precision.test.ts` (reference
tables, singularity neighborhoods, all supported places) and the trigonometry
suite in `test/trigonometry.test.ts`.
