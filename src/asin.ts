import { fromContextValue, registerFunction } from "./core/value";
import { asin_value } from "./trigonometry/asin";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function asin(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, asin_value);
}

registerFunction("asin", asin);
