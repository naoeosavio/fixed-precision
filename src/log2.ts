import { log2_value } from "./arithmetic/log2";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function log2(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, log2_value);
}

registerFunction("log2", log2);
