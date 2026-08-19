import { fromContextValue, registerFunction } from "./core/value";
import { sec_value } from "./trigonometry/sec";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function sec(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, sec_value);
}

registerFunction("sec", sec);
