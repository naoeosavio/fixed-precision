import { fromContextValue, registerFunction } from "./core/value";
import { atanh_value } from "./trigonometry/atanh";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function atanh(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, atanh_value);
}

registerFunction("atanh", atanh);
