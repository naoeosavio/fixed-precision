import { power } from "./arithmetic/power";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function cube(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) => power(raw, 3, ctx.SCALE));
}

registerFunction("cube", cube);
