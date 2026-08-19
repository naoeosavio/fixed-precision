import { power } from "./arithmetic/power";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function pow(
  value: FixedPrecisionValue,
  exp: number,
): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) => power(raw, exp, ctx.SCALE));
}

registerFunction("pow", pow);
