import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function neg(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw) => -raw);
}

registerFunction("neg", neg);
