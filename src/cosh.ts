import { fromContextValue, registerFunction } from "./core/value";
import { cosh_value } from "./trigonometry/cosh";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function cosh(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, cosh_value);
}

registerFunction("cosh", cosh);
