import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function abs(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, (raw) => (raw < 0n ? -raw : raw));
}

registerFunction("abs", abs);
