import { power } from "./arithmetic/power";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function square(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) => power(raw, 2, ctx.SCALE));
}

registerFunction("square", square);
