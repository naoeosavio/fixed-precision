import { fromContextValue, registerFunction } from "./core/value";
import { asec_value } from "./trigonometry/asec";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function asec(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, asec_value);
}

registerFunction("asec", asec);
