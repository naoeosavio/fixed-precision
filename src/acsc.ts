import { fromContextValue, registerFunction } from "./core/value";
import { acsc_value } from "./trigonometry/acsc";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function acsc(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, acsc_value);
}

registerFunction("acsc", acsc);
