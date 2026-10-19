# Migrating to v2

`fixed-precision` v2 keeps the class API exactly as it was and no longer ships
the functional layer. Standalone operations moved to their own package,
`fixed-precision-fns`.

## Who is affected

Only code that imported a subpath other than the root or `/minimal` — that is,
code that used the functional API.

| v1 | v2 |
|----|----|
| `fixed-precision` (class) | unchanged |
| `fixed-precision/minimal` | unchanged |
| `fixed-precision/abs` | `fixed-precision-fns/abs` |
| `fixed-precision/acos` | `fixed-precision-fns/acos` |
| `fixed-precision/acosh` | `fixed-precision-fns/acosh` |
| `fixed-precision/acot` | `fixed-precision-fns/acot` |
| `fixed-precision/acoth` | `fixed-precision-fns/acoth` |
| `fixed-precision/acsc` | `fixed-precision-fns/acsc` |
| `fixed-precision/acsch` | `fixed-precision-fns/acsch` |
| `fixed-precision/add` | `fixed-precision-fns/add` |
| `fixed-precision/asec` | `fixed-precision-fns/asec` |
| `fixed-precision/asech` | `fixed-precision-fns/asech` |
| `fixed-precision/asin` | `fixed-precision-fns/asin` |
| `fixed-precision/asinh` | `fixed-precision-fns/asinh` |
| `fixed-precision/atan` | `fixed-precision-fns/atan` |
| `fixed-precision/atan2` | `fixed-precision-fns/atan2` |
| `fixed-precision/atanh` | `fixed-precision-fns/atanh` |
| `fixed-precision/bitAnd` | `fixed-precision-fns/bitAnd` |
| `fixed-precision/bitNot` | `fixed-precision-fns/bitNot` |
| `fixed-precision/bitOr` | `fixed-precision-fns/bitOr` |
| `fixed-precision/bitXor` | `fixed-precision-fns/bitXor` |
| `fixed-precision/cbrt` | `fixed-precision-fns/cbrt` |
| `fixed-precision/ceil` | `fixed-precision-fns/ceil` |
| `fixed-precision/clamp` | `fixed-precision-fns/clamp` |
| `fixed-precision/cmp` | `fixed-precision-fns/cmp` |
| `fixed-precision/combinations` | `fixed-precision-fns/combinations` |
| `fixed-precision/compare` | `fixed-precision-fns/compare` |
| `fixed-precision/compose` | `fixed-precision-fns/compose` |
| `fixed-precision/cos` | `fixed-precision-fns/cos` |
| `fixed-precision/cosh` | `fixed-precision-fns/cosh` |
| `fixed-precision/cot` | `fixed-precision-fns/cot` |
| `fixed-precision/coth` | `fixed-precision-fns/coth` |
| `fixed-precision/createFactory` | `fixed-precision-fns/createFactory` |
| `fixed-precision/cross` | `fixed-precision-fns/cross` |
| `fixed-precision/csc` | `fixed-precision-fns/csc` |
| `fixed-precision/csch` | `fixed-precision-fns/csch` |
| `fixed-precision/cube` | `fixed-precision-fns/cube` |
| `fixed-precision/dataOf` | `fixed-precision-fns/dataOf` |
| `fixed-precision/divide` | `fixed-precision-fns/divide` |
| `fixed-precision/divmod` | `fixed-precision-fns/divmod` |
| `fixed-precision/dot` | `fixed-precision-fns/dot` |
| `fixed-precision/e` | `fixed-precision-fns/e` |
| `fixed-precision/eql` | `fixed-precision-fns/eql` |
| `fixed-precision/equals` | `fixed-precision-fns/equals` |
| `fixed-precision/exp` | `fixed-precision-fns/exp` |
| `fixed-precision/factorial` | `fixed-precision-fns/factorial` |
| `fixed-precision/floor` | `fixed-precision-fns/floor` |
| `fixed-precision/fraction` | `fixed-precision-fns/fraction` |
| `fixed-precision/fromNumber` | `fixed-precision-fns/fromNumber` |
| `fixed-precision/fromString` | `fixed-precision-fns/fromString` |
| `fixed-precision/getDenominator` | `fixed-precision-fns/getDenominator` |
| `fixed-precision/getNumerator` | `fixed-precision-fns/getNumerator` |
| `fixed-precision/greaterThan` | `fixed-precision-fns/greaterThan` |
| `fixed-precision/greaterThanOrEqual` | `fixed-precision-fns/greaterThanOrEqual` |
| `fixed-precision/gte` | `fixed-precision-fns/gte` |
| `fixed-precision/gtn` | `fixed-precision-fns/gtn` |
| `fixed-precision/hypot` | `fixed-precision-fns/hypot` |
| `fixed-precision/idiv` | `fixed-precision-fns/idiv` |
| `fixed-precision/idivmod` | `fixed-precision-fns/idivmod` |
| `fixed-precision/isNegative` | `fixed-precision-fns/isNegative` |
| `fixed-precision/isPositive` | `fixed-precision-fns/isPositive` |
| `fixed-precision/isZero` | `fixed-precision-fns/isZero` |
| `fixed-precision/leftShift` | `fixed-precision-fns/leftShift` |
| `fixed-precision/lessThan` | `fixed-precision-fns/lessThan` |
| `fixed-precision/lessThanOrEqual` | `fixed-precision-fns/lessThanOrEqual` |
| `fixed-precision/log` | `fixed-precision-fns/log` |
| `fixed-precision/log10` | `fixed-precision-fns/log10` |
| `fixed-precision/log2` | `fixed-precision-fns/log2` |
| `fixed-precision/logicalAnd` | `fixed-precision-fns/logicalAnd` |
| `fixed-precision/logicalNot` | `fixed-precision-fns/logicalNot` |
| `fixed-precision/logicalOr` | `fixed-precision-fns/logicalOr` |
| `fixed-precision/logicalXor` | `fixed-precision-fns/logicalXor` |
| `fixed-precision/lte` | `fixed-precision-fns/lte` |
| `fixed-precision/ltn` | `fixed-precision-fns/ltn` |
| `fixed-precision/max` | `fixed-precision-fns/max` |
| `fixed-precision/min` | `fixed-precision-fns/min` |
| `fixed-precision/minus` | `fixed-precision-fns/minus` |
| `fixed-precision/mod` | `fixed-precision-fns/mod` |
| `fixed-precision/multiply` | `fixed-precision-fns/multiply` |
| `fixed-precision/naturalLog` | `fixed-precision-fns/naturalLog` |
| `fixed-precision/neg` | `fixed-precision-fns/neg` |
| `fixed-precision/neq` | `fixed-precision-fns/neq` |
| `fixed-precision/notEquals` | `fixed-precision-fns/notEquals` |
| `fixed-precision/partial` | `fixed-precision-fns/partial` |
| `fixed-precision/permutations` | `fixed-precision-fns/permutations` |
| `fixed-precision/phi` | `fixed-precision-fns/phi` |
| `fixed-precision/pi` | `fixed-precision-fns/pi` |
| `fixed-precision/pipe` | `fixed-precision-fns/pipe` |
| `fixed-precision/plus` | `fixed-precision-fns/plus` |
| `fixed-precision/pow` | `fixed-precision-fns/pow` |
| `fixed-precision/precision` | `fixed-precision-fns/precision` |
| `fixed-precision/random` | `fixed-precision-fns/random` |
| `fixed-precision/ratio` | `fixed-precision-fns/ratio` |
| `fixed-precision/rem` | `fixed-precision-fns/rem` |
| `fixed-precision/rightShift` | `fixed-precision-fns/rightShift` |
| `fixed-precision/root` | `fixed-precision-fns/root` |
| `fixed-precision/round` | `fixed-precision-fns/round` |
| `fixed-precision/scale` | `fixed-precision-fns/scale` |
| `fixed-precision/sec` | `fixed-precision-fns/sec` |
| `fixed-precision/sech` | `fixed-precision-fns/sech` |
| `fixed-precision/shift` | `fixed-precision-fns/shift` |
| `fixed-precision/sign` | `fixed-precision-fns/sign` |
| `fixed-precision/sin` | `fixed-precision-fns/sin` |
| `fixed-precision/sinh` | `fixed-precision-fns/sinh` |
| `fixed-precision/sqrt` | `fixed-precision-fns/sqrt` |
| `fixed-precision/sqrt2` | `fixed-precision-fns/sqrt2` |
| `fixed-precision/square` | `fixed-precision-fns/square` |
| `fixed-precision/stringify` | `fixed-precision-fns/stringify` |
| `fixed-precision/subtract` | `fixed-precision-fns/subtract` |
| `fixed-precision/sum` | `fixed-precision-fns/sum` |
| `fixed-precision/tan` | `fixed-precision-fns/tan` |
| `fixed-precision/tanh` | `fixed-precision-fns/tanh` |
| `fixed-precision/times` | `fixed-precision-fns/times` |
| `fixed-precision/toBase` | `fixed-precision-fns/toBase` |
| `fixed-precision/toExponential` | `fixed-precision-fns/toExponential` |
| `fixed-precision/toFixed` | `fixed-precision-fns/toFixed` |
| `fixed-precision/toNearest` | `fixed-precision-fns/toNearest` |
| `fixed-precision/toNumber` | `fixed-precision-fns/toNumber` |
| `fixed-precision/toPrecision` | `fixed-precision-fns/toPrecision` |
| `fixed-precision/trunc` | `fixed-precision-fns/trunc` |

## How to migrate

1. Install the functional package:

   ```bash
   npm install fixed-precision-fns
   ```

2. Rename the imports. The subpath names are identical, only the package name
   changes:

   ```bash
   # every import of the functional layer
   sed -i 's#from "fixed-precision/#from "fixed-precision-fns/#g' \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.mjs' \)
   ```

   Review the result: `fixed-precision/minimal` must stay untouched, and the
   bare `fixed-precision` import stays as-is.

3. If a file imported both the class and a functional subpath, it now has two
   imports — that is expected:

   ```ts
   import FixedPrecision from "fixed-precision";
   import { add } from "fixed-precision-fns/add";
   ```

4. If you relied on the functional barrel, it moved with everything else:

   ```diff
   - import { add, pipe } from "fixed-precision";
   + import { add, pipe } from "fixed-precision-fns";
   ```

## Behaviour

No behavioural change: the functions are the same code. `fixed-precision-fns`
builds the value-level operations into its own entries, so installing it does
not require `fixed-precision` at runtime.

## Not affected

The class API (`new FixedPrecision`, `FixedPrecision.create`,
`fixedconfig`, `Minimal`) is untouched, including rounding modes, error
messages and the BigInt caveat.
