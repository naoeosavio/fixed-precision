import { fromContextValue, registerFunction } from "./core/value";
import { coth_value } from "./trigonometry/coth";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function coth(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, coth_value);
}

registerFunction("coth", coth);
