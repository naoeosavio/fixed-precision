import { fromContextValue, registerFunction } from "./core/value";
import { cot_value } from "./trigonometry/cot";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function cot(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, cot_value);
}

registerFunction("cot", cot);
