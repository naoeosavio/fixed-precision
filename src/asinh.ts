import { fromContextValue, registerFunction } from "./core/value";
import { asinh_value } from "./trigonometry/asinh";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function asinh(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, asinh_value);
}

registerFunction("asinh", asinh);
