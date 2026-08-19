import { fromContextValue, registerFunction } from "./core/value";
import { tanh_value } from "./trigonometry/tanh";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function tanh(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, tanh_value);
}

registerFunction("tanh", tanh);
