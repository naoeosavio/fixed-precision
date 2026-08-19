import { fromContextValue, registerFunction } from "./core/value";
import { acosh_value } from "./trigonometry/acosh";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function acosh(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, acosh_value);
}

registerFunction("acosh", acosh);
