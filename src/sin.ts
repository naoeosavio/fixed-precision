import { fromContextValue, registerFunction } from "./core/value";
import { sin_value } from "./trigonometry/sin";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function sin(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, sin_value);
}

registerFunction("sin", sin);
