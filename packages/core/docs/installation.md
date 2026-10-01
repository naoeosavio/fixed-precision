# Installation

## Package Managers

```bash
# npm
npm install fixed-precision

# yarn
yarn add fixed-precision

# pnpm
pnpm add fixed-precision

# bun
bun add fixed-precision
```

## Requirements

| Environment | Minimum Version |
|---|---|
| Node.js | 10+ (with `--harmony-bigint` for < 12) |
| TypeScript | 4.0+ |
| Browsers | Chrome 67+, Firefox 68+, Safari 14+, Edge 79+ |

FixedPrecision uses `BigInt` internally. Ensure your runtime supports it.

## ESM & CommonJS

The package provides dual format support:

```ts
// ESM (recommended)
import FixedPrecision, { fixedconfig } from "fixed-precision";

// CommonJS
const { default: FixedPrecision, fixedconfig } = require("fixed-precision");
```

TypeScript declarations are provided for both formats automatically.

## Minimal Build

For projects that only need core decimal operations without the full API surface (no `fixedconfig`, `FixedPrecisionScale`, etc.), use the minimal entry point:

```bash
npm install fixed-precision
```

```ts
// ~40% smaller bundle
import { FixedPrecision } from "fixed-precision/minimal";
```

See [Minimal Build](minimal.md) for details on what's included and excluded.

## CDN / Browser

```html
<script type="module">
  import FixedPrecision from "https://cdn.jsdelivr.net/npm/fixed-precision@1/dist/FixedPrecision.js";
</script>
```

Or via import maps:

```html
<script type="importmap">
  {
    "imports": {
      "fixed-precision": "https://cdn.jsdelivr.net/npm/fixed-precision@1/dist/FixedPrecision.js"
    }
  }
</script>
```

## Build from Source

```bash
git clone https://github.com/naoeosavio/fixed-precision.git
cd fixed-precision
npm install
npm run build        # produces dist/
npm run test         # run the test suite
```

The compiled output lands in `dist/` (ESM: `.js`, CJS: `.cjs`, declarations: `.d.ts` / `.d.cts`).

## Verifying Installation

```ts
import FixedPrecision from "fixed-precision";

const v = new FixedPrecision("1.50");
console.log(v.toString()); // "1.5"
```

## Next Steps

- [Quick Start](quick-start.md) — basic usage and examples
- [Basic Concepts](concepts.md) — core architecture
