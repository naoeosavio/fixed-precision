# Migrating to v2

`fixed-precision` v2 keeps the class API exactly as it was and no longer ships
the functional layer. Standalone operations moved to their own package,
`fixed-precision-fp`.

## Who is affected

Only code that imported a subpath other than the root or `/minimal` — that is,
code that used the functional API.

| v1 | v2 |
|----|----|
| `fixed-precision` (class) | unchanged |
| `fixed-precision/minimal` | unchanged |
| `fixed-precision/abs` | `fixed-precision-fp/abs` |
| `fixed-precision/acos` | `fixed-precision-fp/acos` |
| `fixed-precision/acosh` | `fixed-precision-fp/acosh` |
| `fixed-precision/acot` | `fixed-precision-fp/acot` |
| `fixed-precision/acoth` | `fixed-precision-fp/acoth` |
| `fixed-precision/acsc` | `fixed-precision-fp/acsc` |
| `fixed-precision/acsch` | `fixed-precision-fp/acsch` |
| `fixed-precision/add` | `fixed-precision-fp/add` |
| `fixed-precision/asec` | `fixed-precision-fp/asec` |
| `fixed-precision/asech` | `fixed-precision-fp/asech` |
| `fixed-precision/asin` | `fixed-precision-fp/asin` |
| `fixed-precision/asinh` | `fixed-precision-fp/asinh` |
| `fixed-precision/atan` | `fixed-precision-fp/atan` |
| `fixed-precision/atan2` | `fixed-precision-fp/atan2` |
| `fixed-precision/atanh` | `fixed-precision-fp/atanh` |
| `fixed-precision/bitAnd` | `fixed-precision-fp/bitAnd` |
| `fixed-precision/bitNot` | `fixed-precision-fp/bitNot` |
| `fixed-precision/bitOr` | `fixed-precision-fp/bitOr` |
| `fixed-precision/bitXor` | `fixed-precision-fp/bitXor` |
| `fixed-precision/cbrt` | `fixed-precision-fp/cbrt` |
| `fixed-precision/ceil` | `fixed-precision-fp/ceil` |
| `fixed-precision/clamp` | `fixed-precision-fp/clamp` |
| `fixed-precision/cmp` | `fixed-precision-fp/cmp` |
| `fixed-precision/combinations` | `fixed-precision-fp/combinations` |
| `fixed-precision/compare` | `fixed-precision-fp/compare` |
| `fixed-precision/compose` | `fixed-precision-fp/compose` |
| `fixed-precision/cos` | `fixed-precision-fp/cos` |
| `fixed-precision/cosh` | `fixed-precision-fp/cosh` |
| `fixed-precision/cot` | `fixed-precision-fp/cot` |
| `fixed-precision/coth` | `fixed-precision-fp/coth` |
| `fixed-precision/createFactory` | `fixed-precision-fp/createFactory` |
| `fixed-precision/cross` | `fixed-precision-fp/cross` |
| `fixed-precision/csc` | `fixed-precision-fp/csc` |
| `fixed-precision/csch` | `fixed-precision-fp/csch` |
| `fixed-precision/cube` | `fixed-precision-fp/cube` |
| `fixed-precision/dataOf` | `fixed-precision-fp/dataOf` |
| `fixed-precision/divide` | `fixed-precision-fp/divide` |
| `fixed-precision/divmod` | `fixed-precision-fp/divmod` |
| `fixed-precision/dot` | `fixed-precision-fp/dot` |
| `fixed-precision/e` | `fixed-precision-fp/e` |
| `fixed-precision/eql` | `fixed-precision-fp/eql` |
| `fixed-precision/equals` | `fixed-precision-fp/equals` |
| `fixed-precision/exp` | `fixed-precision-fp/exp` |
| `fixed-precision/factorial` | `fixed-precision-fp/factorial` |
| `fixed-precision/floor` | `fixed-precision-fp/floor` |
| `fixed-precision/fraction` | `fixed-precision-fp/fraction` |
| `fixed-precision/fromNumber` | `fixed-precision-fp/fromNumber` |
| `fixed-precision/fromString` | `fixed-precision-fp/fromString` |
| `fixed-precision/getDenominator` | `fixed-precision-fp/getDenominator` |
| `fixed-precision/getNumerator` | `fixed-precision-fp/getNumerator` |
| `fixed-precision/greaterThan` | `fixed-precision-fp/greaterThan` |
| `fixed-precision/greaterThanOrEqual` | `fixed-precision-fp/greaterThanOrEqual` |
| `fixed-precision/gte` | `fixed-precision-fp/gte` |
| `fixed-precision/gtn` | `fixed-precision-fp/gtn` |
| `fixed-precision/hypot` | `fixed-precision-fp/hypot` |
| `fixed-precision/idiv` | `fixed-precision-fp/idiv` |
| `fixed-precision/idivmod` | `fixed-precision-fp/idivmod` |
| `fixed-precision/isNegative` | `fixed-precision-fp/isNegative` |
| `fixed-precision/isPositive` | `fixed-precision-fp/isPositive` |
| `fixed-precision/isZero` | `fixed-precision-fp/isZero` |
| `fixed-precision/leftShift` | `fixed-precision-fp/leftShift` |
| `fixed-precision/lessThan` | `fixed-precision-fp/lessThan` |
| `fixed-precision/lessThanOrEqual` | `fixed-precision-fp/lessThanOrEqual` |
| `fixed-precision/log` | `fixed-precision-fp/log` |
| `fixed-precision/log10` | `fixed-precision-fp/log10` |
| `fixed-precision/log2` | `fixed-precision-fp/log2` |
| `fixed-precision/logicalAnd` | `fixed-precision-fp/logicalAnd` |
| `fixed-precision/logicalNot` | `fixed-precision-fp/logicalNot` |
| `fixed-precision/logicalOr` | `fixed-precision-fp/logicalOr` |
| `fixed-precision/logicalXor` | `fixed-precision-fp/logicalXor` |
| `fixed-precision/lte` | `fixed-precision-fp/lte` |
| `fixed-precision/ltn` | `fixed-precision-fp/ltn` |
| `fixed-precision/max` | `fixed-precision-fp/max` |
| `fixed-precision/min` | `fixed-precision-fp/min` |
| `fixed-precision/minus` | `fixed-precision-fp/minus` |
| `fixed-precision/mod` | `fixed-precision-fp/mod` |
| `fixed-precision/multiply` | `fixed-precision-fp/multiply` |
| `fixed-precision/naturalLog` | `fixed-precision-fp/naturalLog` |
| `fixed-precision/neg` | `fixed-precision-fp/neg` |
| `fixed-precision/neq` | `fixed-precision-fp/neq` |
| `fixed-precision/notEquals` | `fixed-precision-fp/notEquals` |
| `fixed-precision/partial` | `fixed-precision-fp/partial` |
| `fixed-precision/permutations` | `fixed-precision-fp/permutations` |
| `fixed-precision/phi` | `fixed-precision-fp/phi` |
| `fixed-precision/pi` | `fixed-precision-fp/pi` |
| `fixed-precision/pipe` | `fixed-precision-fp/pipe` |
| `fixed-precision/plus` | `fixed-precision-fp/plus` |
| `fixed-precision/pow` | `fixed-precision-fp/pow` |
| `fixed-precision/precision` | `fixed-precision-fp/precision` |
| `fixed-precision/random` | `fixed-precision-fp/random` |
| `fixed-precision/ratio` | `fixed-precision-fp/ratio` |
| `fixed-precision/rem` | `fixed-precision-fp/rem` |
| `fixed-precision/rightShift` | `fixed-precision-fp/rightShift` |
| `fixed-precision/root` | `fixed-precision-fp/root` |
| `fixed-precision/round` | `fixed-precision-fp/round` |
| `fixed-precision/scale` | `fixed-precision-fp/scale` |
| `fixed-precision/sec` | `fixed-precision-fp/sec` |
| `fixed-precision/sech` | `fixed-precision-fp/sech` |
| `fixed-precision/shift` | `fixed-precision-fp/shift` |
| `fixed-precision/sign` | `fixed-precision-fp/sign` |
| `fixed-precision/sin` | `fixed-precision-fp/sin` |
| `fixed-precision/sinh` | `fixed-precision-fp/sinh` |
| `fixed-precision/sqrt` | `fixed-precision-fp/sqrt` |
| `fixed-precision/sqrt2` | `fixed-precision-fp/sqrt2` |
| `fixed-precision/square` | `fixed-precision-fp/square` |
| `fixed-precision/stringify` | `fixed-precision-fp/stringify` |
| `fixed-precision/subtract` | `fixed-precision-fp/subtract` |
| `fixed-precision/sum` | `fixed-precision-fp/sum` |
| `fixed-precision/tan` | `fixed-precision-fp/tan` |
| `fixed-precision/tanh` | `fixed-precision-fp/tanh` |
| `fixed-precision/times` | `fixed-precision-fp/times` |
| `fixed-precision/toBase` | `fixed-precision-fp/toBase` |
| `fixed-precision/toExponential` | `fixed-precision-fp/toExponential` |
| `fixed-precision/toFixed` | `fixed-precision-fp/toFixed` |
| `fixed-precision/toNearest` | `fixed-precision-fp/toNearest` |
| `fixed-precision/toNumber` | `fixed-precision-fp/toNumber` |
| `fixed-precision/toPrecision` | `fixed-precision-fp/toPrecision` |
| `fixed-precision/trunc` | `fixed-precision-fp/trunc` |

## How to migrate

1. Install the functional package:

   ```bash
   npm install fixed-precision-fp
   ```

2. Rename the imports. The subpath names are identical, only the package name
   changes:

   ```bash
   # every import of the functional layer
   sed -i 's#from "fixed-precision/#from "fixed-precision-fp/#g' \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.mjs' \)
   ```

   Review the result: `fixed-precision/minimal` must stay untouched, and the
   bare `fixed-precision` import stays as-is.

3. If a file imported both the class and a functional subpath, it now has two
   imports — that is expected:

   ```ts
   import FixedPrecision from "fixed-precision";
   import { add } from "fixed-precision-fp/add";
   ```

4. If you relied on the functional barrel, it moved with everything else:

   ```diff
   - import { add, pipe } from "fixed-precision";
   + import { add, pipe } from "fixed-precision-fp";
   ```

## Behaviour

No behavioural change: the functions are the same code. `fixed-precision-fp`
builds the value-level operations into its own entries, so installing it does
not require `fixed-precision` at runtime.

## Not affected

The class API (`new FixedPrecision`, `FixedPrecision.create`,
`fixedconfig`, `Minimal`) is untouched, including rounding modes, error
messages and the BigInt caveat.
