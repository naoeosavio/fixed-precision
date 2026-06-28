# Configuration

FixedPrecision offers three levels of configuration: global, factory, and instance-level context. Each level has its own trade-offs.

## Global Configuration

### `FixedPrecision.configure(config)`

Sets the default `places` and `roundingMode` for all new instances created without an explicit context.

```ts
import FixedPrecision from "fixed-precision";

FixedPrecision.configure({ places: 4, roundingMode: 4 });

// All new instances use the global default
const a = new FixedPrecision("19.99");  // 4 places
const b = new FixedPrecision("5.25");   // 4 places
```

### `fixedconfig` shorthand

An alternative import for convenience:

```ts
import { fixedconfig } from "fixed-precision";

fixedconfig.configure({ places: 2, roundingMode: 6 }); // HALF_EVEN
```

### Default values

| Option | Default |
|--------|---------|
| `places` | `8` |
| `roundingMode` | `4` (ROUND_HALF_UP) |

### ⚠️ When to avoid global configuration

Global state is **mutable** and shared across all modules. Avoid it when:

- You need **multiple precisions** in the same application
- The library is used by **different parts of a large codebase**
- You want **deterministic, isolated behavior** per module

```ts
// Problem: two modules competing for different global settings
// Module A
FixedPrecision.configure({ places: 2 });

// Module B (later)
FixedPrecision.configure({ places: 8 });

// Module A's code now breaks — it expects 2 places
```

## Factory Configuration

### `FixedPrecision.create(config)`

Creates an **immutable factory** with a fixed precision context. This is the recommended approach for most applications.

```ts
const Price = FixedPrecision.create({ places: 2, roundingMode: 4 });
const Rate = FixedPrecision.create({ places: 6, roundingMode: 6 });
const Tax = FixedPrecision.create({ places: 2, roundingMode: 1 }); // ROUND_DOWN

const price = Price("19.99");
const rate = Rate("1.085432");
const tax = Tax("1.60");
```

Key properties:
- **Immutable** — once created, the configuration cannot change
- **Isolated** — each factory has its own context
- **Zero overhead after creation** — no per-instance config validation

## Instance-Level Context

Every `FixedPrecision` instance carries an `FPContext` object. In most cases you don't interact with it directly, but it is accessible for advanced use cases.

### Constructor with explicit context

```ts
const ctx = FixedPrecision.makeContext(4, 4);
const value = new FixedPrecision("123.4567", ctx);
```

### `FPContext` structure

```ts
type FPContext = {
  places: number;       // Decimal places
  roundingMode: number; // Rounding mode (0-8)
  SCALE: bigint;        // 10^n as bigint
  SCALENUMBER: number;  // 10^n as number
};
```

### Reading the context

```ts
const value = new FixedPrecision("123.45");
value.places();         // 8 (or whatever current default is)
value.roundingMode();   // 4  (property on constructor, not instance)
```

### Changing context at runtime

Only `scale()` changes the context:

```ts
const value = new FixedPrecision("123.45678900");
const scaled = value.scale(2);

scaled.places(); // 2
```

## Configuration Comparison

| Aspect | Global | Factory | Instance Context |
|--------|--------|---------|-----------------|
| **Mutability** | Mutable | Immutable | Immutable (after creation) |
| **Multiple precisions** | No | Yes | Yes |
| **Configuration overhead** | None | Once (at creation) | Per instance |
| **Scope** | Application-wide | Per factory | Per instance |
| **Recommended for** | Quick scripts | Production apps | Advanced/scaling |

## Migration between configurations

### From global to factory

```ts
// Before (global)
FixedPrecision.configure({ places: 2 });
new FixedPrecision("19.99").add("5.25");

// After (factory)
const FP2 = FixedPrecision.create({ places: 2 });
FP2("19.99").add(FP2("5.25"));
```

### Converting between factories

```ts
const Price = FixedPrecision.create({ places: 2 });
const Rate = FixedPrecision.create({ places: 6 });

const price = Price("19.99");
const rate = Rate("1.085432");

// Convert rate to price's precision
const converted = Price(rate.toString());
const total = price.mul(converted);
```

## Next Steps

- [Factories](factories.md) — deep dive into factory benefits and patterns
- [Types](types.md) — TypeScript type definitions
- [API Reference](api-reference.md) — complete method documentation
