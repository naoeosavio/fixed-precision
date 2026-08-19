import { fromContextValue, registerFunction } from "./core/value";
import { csc_value } from "./trigonometry/csc";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function csc(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, csc_value);
}

registerFunction("csc", csc);
