import { fromContextValue, registerFunction } from "./core/value";
import { atan_value } from "./trigonometry/atan";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function atan(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, atan_value);
}

registerFunction("atan", atan);
