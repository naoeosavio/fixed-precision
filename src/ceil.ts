import { round_value } from "./arithmetic/round";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function ceil(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw, ctx) => round_value(raw, 0, 2, ctx));
}

registerFunction("ceil", ceil);
