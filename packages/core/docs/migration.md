# Migration Guide

This guide helps you migrate from other popular decimal libraries to FixedPrecision.

## Comparison Table

Below is a quick reference of method names across libraries. See the [full comparison](../bench/compare.md) for complete coverage.

### Arithmetic

| Operation | Big.js | BigNumber.js | Decimal.js | **FixedPrecision** |
|-----------|--------|-------------|------------|-------------------|
| add | `plus` | `plus` | `plus` | `add` |
| subtract | `minus` | `minus` | `minus` | `sub` |
| multiply | `times` | `times` | `times` | `mul` |
| divide | `div` | `div` | `div` | `div` |
| modulo | `mod` | `mod` | `mod` | `mod` |
| pow | `pow` | `pow` | `pow` | `pow` |
| sqrt | `sqrt` | `sqrt` | `sqrt` | `sqrt` |
| abs | `abs` | `abs` | `abs` | `abs` |
| negate | `neg` | `negated` | `negated` | `neg` |

### Comparison

| Operation | Big.js | BigNumber.js | Decimal.js | **FixedPrecision** |
|-----------|--------|-------------|------------|-------------------|
| compare | `cmp` | `comparedTo` | `cmp` | `cmp` |
| equals | `eq` | `eq` | `eq` | `eq` |
| greater than | `gt` | `gt` | `gt` | `gt` |
| greater or equal | `gte` | `gte` | `gte` | `gte` |
| less than | `lt` | `lt` | `lt` | `lt` |
| less or equal | `lte` | `lte` | `lte` | `lte` |

### Rounding & Formatting

| Operation | Big.js | BigNumber.js | Decimal.js | **FixedPrecision** |
|-----------|--------|-------------|------------|-------------------|
| round | `round` | `decimalPlaces` | `toDecimalPlaces` | `round` |
| precision | `prec` | `precision` | `toSignificantDigits` | `prec` |
| ceil | — | — | `ceil` | `ceil` |
| floor | — | — | `floor` | `floor` |
| trunc | — | `integerValue` | `trunc` | `trunc` |
| toString | `toString` | `toString` | `toString` | `toString` |
| toFixed | `toFixed` | `toFixed` | `toFixed` | `toFixed` |
| toExponential | `toExponential` | `toExponential` | `toExponential` | `toExponential` |
| toPrecision | `toPrecision` | `toPrecision` | `toPrecision` | `toPrecision` |
| toJSON | `toJSON` | `toJSON` | `toJSON` | `toJSON` |
| valueOf | `valueOf` | `valueOf` | `valueOf` | `valueOf` |

---

## From Big.js

### Installation

```bash
npm uninstall big.js
npm install fixed-precision
```

### Constructor

```ts
// Big.js
const x = new Big("123.45");

// FixedPrecision
const x = new FixedPrecision("123.45");
```

### Configuration

```ts
// Big.js
Big.DP = 8;
Big.RM = 1; // ROUND_HALF_UP

// FixedPrecision
FixedPrecision.configure({ places: 8, roundingMode: 4 });
```

### Renamed methods

```ts
// Big.js                → FixedPrecision
x.plus(y)                x.add(y)
x.minus(y)               x.sub(y)
x.times(y)               x.mul(y)
x.div(y)                 x.div(y)       // same
x.mod(y)                 x.mod(y)       // same
x.pow(n)                 x.pow(n)       // same
x.sqrt()                 x.sqrt()       // same
x.abs()                  x.abs()        // same
x.neg()                  x.neg()        // same
x.cmp(y)                 x.cmp(y)       // same
x.eq(y)                  x.eq(y)        // same
x.gt(y)                  x.gt(y)        // same
x.gte(y)                 x.gte(y)       // same
x.lt(y)                  x.lt(y)        // same
x.lte(y)                 x.lte(y)       // same
x.round(dp)              x.round(dp)    // same
x.prec(sd)               x.prec(sd)     // same
x.toNumber()             x.toNumber()   // same
x.toString()             x.toString()   // same
x.toFixed(n)             x.toFixed(n)   // same
x.toExponential()        x.toExponential() // same
x.toPrecision(n)         x.toPrecision(n)  // same
x.toJSON()               x.toJSON()     // same
x.valueOf()              x.valueOf()    // same
```

⚠️ Big.js `toPrecision` at precision 0 means "all digits"; FixedPrecision requires a positive integer.

### What FixedPrecision adds (not in Big.js)

- Static methods: `FixedPrecision.add`, `.sub`, `.mul`, `.div`, `.mod`, `.pow`, `.sqrt`, `.abs`, `.round`, `.ceil`, `.floor`, `.trunc`, `.exp`, `.ln`, `.log`, `.sin`, `.cos`, `.tan`, etc.
- Trigonometric functions: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `sinh`, `cosh`, `tanh`, etc.
- Log/exp: `ln`, `log`, `log10`, `log2`, `exp`
- Statistics: `min`, `max`, `sum`, `hypot`
- Combinatorics: `factorial`, `permutations`, `combinations`
- Bitwise: `bitAnd`, `bitOr`, `bitXor`, `bitNot`, `leftShift`, `rightArithShift`
- Logical: `not`, `and`, `or`, `xor`
- Base conversion: `toBinary`, `toOctal`, `toHex`
- Factories: `FixedPrecision.create({ places: n })`
- Raw operations: `plus`, `minus`, `times`, `ratio`, `rem`
- `divmod`, `rest`, `clamp`, `toNearest`, `shiftedBy`
- Constants: `PI()`, `e()`, `phi()`, `sqrt2()`

---

## From BigNumber.js

### Installation

```bash
npm uninstall bignumber.js
npm install fixed-precision
```

### Configuration

```ts
// BigNumber.js
BigNumber.config({ DECIMAL_PLACES: 8, ROUNDING_MODE: BigNumber.ROUND_HALF_UP });

// FixedPrecision
FixedPrecision.configure({ places: 8, roundingMode: 4 });
```

### Renamed methods

```ts
// BigNumber.js          → FixedPrecision
x.plus(y)                x.add(y)
x.minus(y)               x.sub(y)
x.times(y)               x.mul(y)
x.div(y)                 x.div(y)       // same
x.mod(y)                 x.mod(y)       // same
x.pow(n)                 x.pow(n)       // same
x.sqrt()                 x.sqrt()       // same
x.abs()                  x.abs()        // same
x.negated()              x.neg()
x.comparedTo(y)          x.cmp(y)
x.eq(y)                  x.eq(y)        // same
x.gt(y)                  x.gt(y)        // same
x.gte(y)                 x.gte(y)       // same
x.lt(y)                  x.lt(y)        // same
x.lte(y)                 x.lte(y)       // same
x.isZero()               x.isZero()     // same
x.isNegative()           x.isNegative() // same
x.isPositive()           x.isPositive() // same
x.isInteger()            x.isInteger()  // same
x.decimalPlaces(dp)      x.round(dp)    // or x.scale(dp)
x.precision(sd)          x.prec(sd)
x.integerValue()         x.trunc()
x.toNumber()             x.toNumber()   // same
x.toFixed(n)             x.toFixed(n)   // same
x.toExponential()        x.toExponential() // same
x.toPrecision(n)         x.toPrecision(n)  // same
x.toJSON()               x.toJSON()     // same
x.valueOf()              x.valueOf()    // same
x.toFraction()           x.fraction()
```

### Cloning

```ts
// BigNumber.js
const Decimal = BigNumber.clone({ DECIMAL_PLACES: 4 });

// FixedPrecision
const FP4 = FixedPrecision.create({ places: 4 });
```

### What FixedPrecision adds (not in BigNumber.js)

- Trigonometric functions, raw operations, bitwise, logical, `divmod`, `rest`, `clamp`, `toNearest`, `shiftedBy`, base conversion, constants (`PI`, `e`, `phi`, `sqrt2`), combinatorics, matrix (`dot`, `cross`).

### What BigNumber.js has that FixedPrecision doesn't

- `toFormat` with thousands separators (Minimal build includes it; full build does not)

---

## From Decimal.js

### Installation

```bash
npm uninstall decimal.js
npm install fixed-precision
```

### Configuration

```ts
// Decimal.js
Decimal.set({ precision: 8, rounding: Decimal.ROUND_HALF_UP });

// FixedPrecision
FixedPrecision.configure({ places: 8, roundingMode: 4 });
```

### Renamed methods

```ts
// Decimal.js            → FixedPrecision
x.plus(y)                x.add(y)
x.minus(y)               x.sub(y)
x.times(y)               x.mul(y)
x.dividedBy(y)           x.div(y)
x.mod(y)                 x.mod(y)       // same
x.pow(n)                 x.pow(n)       // same
x.sqrt()                 x.sqrt()       // same
x.abs()                  x.abs()        // same
x.negated()              x.neg()
x.cmp(y)                 x.cmp(y)       // same
x.eq(y)                  x.eq(y)        // same
x.gt(y)                  x.gt(y)        // same
x.gte(y)                 x.gte(y)       // same
x.lt(y)                  x.lt(y)        // same
x.lte(y)                 x.lte(y)       // same
x.isZero()               x.isZero()     // same
x.isNegative()           x.isNegative() // same
x.isPositive()           x.isPositive() // same
x.isInteger()            x.isInteger()  // same
x.toDecimalPlaces(dp)    x.round(dp)    // or x.scale(dp)
x.toSignificantDigits(sd) x.prec(sd)
x.toNearest(n)           x.toNearest(n) // same
x.ceil()                 x.ceil()       // same
x.floor()                x.floor()      // same
x.trunc()                x.trunc()      // same
x.cubeRoot()             x.cbrt()       // same
x.ln()                   x.ln()         // same
x.log(base)              x.log(base)    // same
x.exp()                  x.exp()        // same
x.sin()                  x.sin()        // same
x.cos()                  x.cos()        // same
x.tan()                  x.tan()        // same
x.asin()                 x.asin()       // same
x.acos()                 x.acos()       // same
x.atan()                 x.atan()       // same
x.sinh()                 x.sinh()       // same
x.cosh()                 x.cosh()       // same
x.tanh()                 x.tanh()       // same
x.asinh()                x.asinh()      // same
x.acosh()                x.acosh()      // same
x.atanh()                x.atanh()      // same
x.toFraction()           x.fraction()
x.toBinary()             x.toBinary()    // same
x.toOctal()              x.toOctal()     // same
x.toHex()                x.toHex()       // same
x.dp                     x.places()      // method, not property
x.sd                     x.precision()   // or x.sd()
```

### Cloning

```ts
// Decimal.js
const D = Decimal.clone({ precision: 4 });

// FixedPrecision
const FP4 = FixedPrecision.create({ places: 4 });
```

### What FixedPrecision adds (not in Decimal.js)

- Raw operations, `divmod`/`rest`, bitwise, logical, raw comparisons, full inverse trig (`acot`, `asec`, `acsc`, `asech`, `acsch`, `acoth`), `shiftedBy`, `clamp`, constants (`PI`, `e`, `phi`, `sqrt2`), combinatorics, matrix (`dot`, `cross`), `hypot`.

### What Decimal.js has that FixedPrecision doesn't

- `toFormat` with optional formatting template
- Variable precision (`precision` vs fixed `places`)

---

## From Math.js

### Installation

```bash
npm uninstall mathjs
npm install fixed-precision
```

Math.js uses a different paradigm (factory function `math.bignumber()`, chained `.done()`). The closest mapping:

```ts
// Math.js
const x = math.bignumber("123.45");
const y = math.bignumber("67.89");
math.add(x, y);       // functional style
x.add(y).done();       // chained style

// FixedPrecision
const x = new FixedPrecision("123.45");
const y = new FixedPrecision("67.89");
x.add(y);              // always returns a new FixedPrecision
```

### Renamed methods

```ts
// Math.js              → FixedPrecision
x.add(y)                 x.add(y)        // same
x.sub(y)                 x.sub(y)        // same
x.multiply(y)            x.mul(y)
x.divide(y)              x.div(y)        // same
x.mod(y)                 x.mod(y)        // same
x.pow(n)                 x.pow(n)        // same
x.sqrt()                 x.sqrt()        // same
x.abs()                  x.abs()         // same
x.round()                x.round()
x.ceil()                 x.ceil()        // same
x.floor()                x.floor()       // same
x.compare(y)             x.cmp(y)
x.equal(y)               x.eq(y)
x.larger(y)              x.gt(y)
x.largerEq(y)            x.gte(y)
x.smaller(y)             x.lt(y)
x.smallerEq(y)           x.lte(y)
```

### Key differences

- Math.js uses functional style (`math.add(a, b)`) extensively; FixedPrecision prefers chaining (`a.add(b)`)
- Math.js has a huge API surface (~180 methods); FixedPrecision focuses on decimal arithmetic (~156 methods)
- Math.js `bignumber` uses variable precision; FixedPrecision uses fixed places

---

## Quick Migration Table

| Concept | Big.js | BigNumber.js | Decimal.js | Math.js | **FixedPrecision** |
|---------|--------|-------------|------------|---------|-------------------|
| Import | `Big` | `BigNumber` | `Decimal` | `math` | `FixedPrecision` |
| Constructor | `new Big(v)` | `new BigNumber(v)` | `new Decimal(v)` | `math.bignumber(v)` | `new FixedPrecision(v)` |
| Config | `Big.DP = n` | `.config({})` | `.set({})` | `.config({})` | `.configure({})` |
| Factory | — | `.clone({})` | `.clone({})` | `.create({})` | `.create({})` |
| Places | `Big.DP` | `DECIMAL_PLACES` | `precision` | `precision` | `places` |
| Default places | 0 | 20 | 20 | 64 | **8** |
| Rounding default | HALF_UP | HALF_UP | HALF_UP | HALF_EVEN | **HALF_UP (4)** |
| Add | `plus` | `plus` | `plus` | `add` | `add` |
| Subtract | `minus` | `minus` | `minus` | `subtract` | `sub` |
| Multiply | `times` | `times` | `times` | `multiply` | `mul` |
| Divide | `div` | `div` | `div` | `divide` | `div` |
| Precision (sig figs) | `prec` | `precision` | `toSignificantDigits` | — | `prec` |
| Truncate | — | `integerValue` | `truncated` | `fix` | `trunc` |
| Negate | `neg` | `negated` | `negated` | `unaryMinus` | `neg` |

## Breaking Changes to Watch For

1. **Precision model**: FixedPrecision uses fixed `places` (number of decimal digits), not variable `precision` (total significant digits). This means `"0.00123"` consumes 5 places of precision in Decimal.js but only 2 non-zero decimal digits in FixedPrecision.

2. **Default places = 8**: Unlike Decimal.js (default 20) or Big.js (default 0). Configure explicitly if you need different precision.

3. **BigInt pre-scaling**: BigInt values are treated as pre-scaled (`× 10^places`), unlike Decimal.js where they represent exact integer digits.

4. **No `toFormat` in full build**: The full build does not include `toFormat` with thousands separators. Use the [Minimal Build](minimal.md) if you need this, or format externally.

5. **No mutating methods**: All methods return new instances. There is no equivalent of Decimal.js's mutating operations.

## Next Steps

- [Quick Start](quick-start.md) — get up and running quickly
- [Integration Guide](integration.md) — integrating with frameworks
- [Testing Guide](testing.md) — testing strategies
