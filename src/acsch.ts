import { fromContextValue, registerFunction } from "./core/value";
import { acsch_value } from "./trigonometry/acsch";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function acsch(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, acsch_value);
}

registerFunction("acsch", acsch);
