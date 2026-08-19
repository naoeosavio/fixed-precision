import { fromContextValue, registerFunction } from "./core/value";
import { sech_value } from "./trigonometry/sech";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function sech(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, sech_value);
}

registerFunction("sech", sech);
