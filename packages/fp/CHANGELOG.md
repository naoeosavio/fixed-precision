# Changelog

All notable changes to the `fixed-precision-fns` package will be documented in
this file. For the class API, see
[`fixed-precision`](../core/CHANGELOG.md).

## [0.9.0] — unreleased

### Breaking Changes

- `sign` now throws on `NaN` and non-numeric strings instead of returning
  `NaN`.
- `factorial`/`permutations`/`combinations` now throw when the index is not
  a safe integer.

### Features

- Export `pipe`, `compose` and `partial` from the functional barrel.
- `pipe`/`compose` typings are now recursive and tail-call optimized: chains up
  to TypeScript's tail-recursion limit (~1000 stages) stay fully typed,
  including `partial`-bound stages.
- `partial` infers the trailing argument tuple from the function signature
  instead of `any[]`.
- `resolveContextPair` follows the deterministic tie-break (greater `places`,
  then smaller `roundingMode`), same as the class/Minimal `preferContext`.
- Raw operations without rescaling: `plus`, `minus`, `times`, `ratio`, `rem`
  and the relational `cmp`, `eq`, `gt`, `gte`, `lt`, `lte`, `neq`. They trust
  the context of whichever operand is fixed-precision data instead of
  resolving the pair, so callers must pass compatible contexts; both
  operands being primitives falls back to the default context.
- Curried `*By` variants for every arithmetic and relational operation
  (`addBy`, `subtractBy`, `multiplyBy`, `divideBy`, `modBy`, `idivBy`,
  `idivmodBy`, `clampBy`, `toNearestBy`, `shiftedBy`, `powBy`, `rootBy`,
  `roundBy`, `scaleBy`, `precisionBy`, `significantDigitsBy`, `logBy`,
  `plusBy`, `minusBy`, `timesBy`, `ratioBy`, `remBy`, `cmpBy`, `eqBy`,
  `gtBy`, `gteBy`, `ltBy`, `lteBy`, `neqBy`, `bitAndBy`, `bitOrBy`,
  `bitXorBy`).

### Fixes

- Package subpath exports that pointed at files the build never emitted now
  resolve: `./eq` → `./eql`, `./gt` → `./gtn`, `./lt` → `./ltn` (the raw
  relational ops are named `eql`/`gtn`/`ltn`), `./rightArithShift` →
  `./rightShift`, `./shiftedBy` → `./shift`. The phantom
  `./significantDigits` was removed — `./precision` already exports it.
- New subpath exports for functions that were built but unreachable:
  `fixed-precision-fns/eql`, `/gtn`, `/ltn`, `/neq`, `/compose`, `/partial`.
- `neq`/`neqBy` are re-exported by the functional barrel; they were missing
  from `src/relational/index.ts`, so the root entry never exposed them.

### Documentation

- Documented the relationship between the `*By` curried variants and `partial`:
  `addBy(amount)` is exactly `partial(add, amount)`, both are kept by design
  (discoverability, self-documenting call sites, precise types, no-arg
  default-parameter forms), and `partial` remains the general mechanism for
  binding multiple or non-trailing arguments. See
  [The `*By` functions and `partial`](docs/functional-design.md#the-by-functions-and-partial).
- Documented that `FixedPrecision.configure()` does not affect the functional
  API in `configuration.md`.
- Documented pipe barrel exports and tail-call-optimized typed chains in
  `api-reference.md`.

### Performance

- Centralized pair scaling in `toScaledPair`/`toScaledData` with a single
  validation pass per operand and a single-ctx-load validator. Removed the
  redundant same-ctx fast path from binary ops: it saved ~zero on hit (the
  same-ctx path inside `toScaledPair` is already cheap — `preferContext`
  short-circuits and `toScaledData` passes through) but cost two validations
  plus two comparisons on every miss. Bench (500k iters, 9 runs, paired,
  `same_result=true` across the board), delta of the new `add` vs the old
  fast-path version:

  | case | speedup |
  |------|---------|
  | data+data same ctx | statistical tie |
  | data+data diff places | +41.9–46.6% |
  | data+data diff rounding | +47.6–59.4% |
  | data+number | +40.1–58.9% |
  | number+data | +18.3–25.5% |
  | data+bigint | +62.2–67.8% |
  | data+string | +16.3–22.3% |
  | number+number | +14.2–26.4% |
  | string+string | +7.0% |

- Raw pair scaling `toScaledPairRaw` added as the left-biased counterpart of
  `toScaledPair` (same contract split as `add` vs `plus`): data pairs are
  combined as-is with no compatibility check, only primitive sides are
  scaled, and both-primitive pairs fall back to the default context. Safe
  path keeps `preferContext` resolution. Bench shows the raw variant is
  +88% on data+data same ctx and +17–240% on mixed cases, at the cost of
  skipping rescaling by contract.

## [0.8.0] — 2026-10-19

Initial release. The functional layer of `fixed-precision` v1.x, extracted into
its own package with the same 118 subpaths.

### Notes

- No behavioural change relative to `fixed-precision@1.7.3`: this is the same
  code, moved. Migrating is a rename — see
  [`fixed-precision`'s MIGRATION.md](../core/MIGRATION.md).
- `fixed-precision` is a runtime dependency and is never bundled here, so an app
  that uses both packages has exactly one copy of every operation.
- The barrel entry (`import { add } from "fixed-precision-fns"`) re-exports
  everything; importing from a subpath is what keeps the bundle small.
- `context`, `safeIndex`, `types` and `value` are internal building blocks. They
  are reachable through the barrel but have no subpath, exactly as in v1.7.3.

### Refactors

- Bundle core sources at build time and remove context cache.
- Rename package to `fixed-precision-fns`.
- Remove `FixedPrecision` class and related exports from `Minimal.ts`.

### Documentation

- Document tree-shaking behavior, size floors, and CJS/ESM limitations.

### Tests

- Rewrite tree-shaking tests to measure actual bundle sizes with esbuild and
  rollup.
