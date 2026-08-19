import { fromContextValue, registerFunction } from "./core/value";
import { csch_value } from "./trigonometry/csch";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function csch(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, csch_value);
}

registerFunction("csch", csch);
