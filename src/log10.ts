import { log10_value } from "./arithmetic/log10";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function log10(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, log10_value);
}

registerFunction("log10", log10);
