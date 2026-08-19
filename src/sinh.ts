import { fromContextValue, registerFunction } from "./core/value";
import { sinh_value } from "./trigonometry/sinh";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function sinh(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, sinh_value);
}

registerFunction("sinh", sinh);
