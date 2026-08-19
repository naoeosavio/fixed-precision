import { fromContextValue, registerFunction } from "./core/value";
import { asech_value } from "./trigonometry/asech";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function asech(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, asech_value);
}

registerFunction("asech", asech);
