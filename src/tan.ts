import { fromContextValue, registerFunction } from "./core/value";
import { tan_value } from "./trigonometry/tan";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function tan(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, tan_value);
}

registerFunction("tan", tan);
