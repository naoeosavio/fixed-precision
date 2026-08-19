import { round_value } from "./arithmetic/round";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function floor(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) => round_value(raw, 0, 3, ctx));
}

registerFunction("floor", floor);
