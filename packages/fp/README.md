# fixed-precision-fns

The functional API of [fixed-precision](https://www.npmjs.com/package/fixed-precision):
one subpath per operation, no class instances, no global configuration.

```bash
npm install fixed-precision-fns
```

## Why a separate package

`fixed-precision` v2 ships the class API (`.`, `./minimal`) only. Every standalone
function lives here, so:

- installing `fixed-precision` alone no longer pulls the functional layer;
- each operation is its own entry point, so a bundler keeps only what you import;
- the two packages version and evolve independently.

The operations this package composes (`sqrt_value`, `scale_value`, ...) live in
`fixed-precision/src/core`. The build bundles these sources into the published
entries, so nothing has to resolve the core at runtime. The package declares no
runtime dependencies and no devDependencies; the bridge to the class API works
through plain data.

## Quick start

```ts
import { add } from "fixed-precision-fns/add";
import { multiply, partial, pipe, stringify } from "fixed-precision-fns/pipe";

pipe(partial(add, "2"), partial(multiply, "3"), partial(stringify))("1"); // "9"
```

Every function returns plain data — `{ ctx, value }` — never a class instance:

```ts
import { add } from "fixed-precision-fns/add";
import { stringify } from "fixed-precision-fns/stringify";

const sum = add("1.5", "2.25");
sum.value;              // 375000000n
sum.ctx.places;         // 8
stringify(sum);         // "3.75"
```

## Precision

There is no `configure()` here. The default context is a frozen constant
(8 places, ROUND_HALF_UP); precision comes from the operands or from a factory:

```ts
import { createFactory } from "fixed-precision-fns/createFactory";

const Money = createFactory({ places: 2, roundingMode: 4 });
Money("19.99"); // ctx.places === 2
```

Mixing contexts resolves to the highest `places` (ties broken by rounding mode).
See [Functional API Design](docs/functional-design.md) for the full rationale.

## Bridging with the class

```ts
import FixedPrecision, { fixedconfig } from "fixed-precision";
import { dataOf } from "fixed-precision-fns/dataOf";
import { multiply } from "fixed-precision-fns/multiply";
import { stringify } from "fixed-precision-fns/stringify";

fixedconfig.configure({ places: 4 });

stringify(multiply(dataOf(new FixedPrecision("1.5")), "2")); // "3.0000"
```

## Composition

`fixed-precision-fns/pipe` exports exactly three functions: `pipe`, `compose` and
`partial`. Pipelines are typed end to end (mismatched stages resolve to `never`
instead of falling back to `any`).

Every operation with a trailing parameter also has a `*By` variant (`addBy`,
`toFixedBy`, ...), which binds that argument — identical to
`partial(fn, ...args)`.

More in [Composition Examples](docs/examples/composition.md) and
[Common Patterns](docs/examples/patterns.md).

## API surface

118 subpaths, one per operation:

| Group | Subpaths |
|-------|----------|
| Arithmetic | `add` `subtract` `multiply` `divide` `mod` `rem` `divmod` `idiv` `pow` `sqrt` `cbrt` `root` `exp` `log` `log2` `log10` `round` `floor` `ceil` `trunc` `abs` `neg` `sign` `ratio` `hypot` `clamp` `toNearest` `scale` `shift` `precision` |
| Relational | `compare` `equals` `lessThan` `lessThanOrEqual` `greaterThan` `greaterThanOrEqual` `notEquals` (+ `cmp` `eql` `ltn` `lte` `gtn` `gte` `neq` aliases) |
| Trigonometry | `sin` `cos` `tan` `cot` `sec` `csc` `atan` `atan2` + hyperbolic and inverse counterparts |
| Strings | `stringify` `toFixed` `toExponential` `toPrecision` `toBase` `fromString` `toNumber` `fromNumber` |
| Logic | `isZero` `isPositive` `isNegative` `logicalAnd` `logicalOr` `logicalXor` `logicalNot` |
| Combinatorics | `factorial` `permutations` `combinations` |
| Statistics | `min` `max` `sum` `random` |
| Matrix | `dot` `cross` |
| Fractions | `fraction` `getNumerator` `getDenominator` |
| Bitwise | `bitAnd` `bitOr` `bitXor` `bitNot` `leftShift` `rightShift` |
| Constants | `pi` `e` `phi` `sqrt2` |
| Composition | `pipe` `compose` `partial` |
| Construction | `createFactory` `dataOf` |

## Tree shaking

The package declares `sideEffects: false` and one entry per operation. Both
import styles carry only what the program uses: the subpath import
(`fixed-precision-fns/add`), and the root barrel import
(`import { add } from "fixed-precision-fns"`), because the bundler prunes the
unused barrel exports.

Measured floor for `import { add } from "fixed-precision-fns"`:

| Bundler | Root import | Subpath import |
|---------|-------------|----------------|
| esbuild (min) | 3.06 kB | 3.06 kB |
| esbuild (gzip) | 1.24 kB | 1.24 kB |
| rollup (unminified) | 3.08 kB | 3.08 kB |

The size floor is the `FixedPrecisionOperand` contract: `add` accepts strings,
numbers, bigints and data, so the bundle also keeps the string and number
conversions that the contract requires. Heavier groups — trigonometry, logs,
powers — never enter the `add` graph. A test in
`test/tree-shaking.test.ts` pins this budget in CI.

Two surfaces keep no tree shaking:

- `require("fixed-precision-fns")` (CommonJS) loads the full barrel. Modules
  cannot prune CJS. For the smallest payload, require the per-operation
  subpath (`require("fixed-precision-fns/add")`).
- A bare ESM import at runtime (no bundler) loads every chunk that the barrel
  lists. Use a bundler to reach the measured floor.

## Documentation

- [Functional API Design](docs/functional-design.md) — no global context, `(value, options)` signatures
- [Composition Examples](docs/examples/composition.md) — the same pipeline, four ways
- [Common Patterns](docs/examples/patterns.md) — money, units, batching

Class-level documentation (rounding modes, precision, errors, BigInt caveats)
lives in [`fixed-precision`](../core/README.md).

## License

MIT — see [LICENSE](LICENSE).
