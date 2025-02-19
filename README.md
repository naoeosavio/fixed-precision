# FixedDecimal.js

Precise fixed-scale (8 decimal places) arithmetic for financial calculations.

## Installation

```bash
npm install fixed-decimal
```

### Example Usage

```ts
import FixedDecimal, { fixedconfig } from "./FixedDecimal";

// Configure the library to use 4 decimal places and round to nearest (symmetric)
fixedconfig.configure({ places: 4, roundingMode: 1 });

const num = new FixedDecimal("1.23456");

// Round to 2 decimal places using the configured rounding mode (or override with a different mode)
const rounded = num.round(2);
console.log(rounded.toFixed()); // Example output: "1.23" or "1.24" depending on the value
```
