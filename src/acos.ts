import { fromContextValue, registerFunction } from "./core/value";
import { acos_value } from "./trigonometry/acos";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function acos(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, acos_value);
}

registerFunction("acos", acos);
