import { fromContextValue, registerFunction } from "./core/value";
import { acot_value } from "./trigonometry/acot";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function acot(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, acot_value);
}

registerFunction("acot", acot);
