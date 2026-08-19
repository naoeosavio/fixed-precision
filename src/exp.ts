import { exp_value } from "./arithmetic/exp";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function exp(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, exp_value);
}

registerFunction("exp", exp);
