import { fromContextValue, registerFunction } from "./core/value";
import { acoth_value } from "./trigonometry/acoth";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function acoth(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, acoth_value);
}

registerFunction("acoth", acoth);
