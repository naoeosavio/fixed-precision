import { fromContextValue, registerFunction } from "./core/value";
import { cos_value } from "./trigonometry/cos";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function cos(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, cos_value);
}

registerFunction("cos", cos);
