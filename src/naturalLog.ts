import { natural_log_value } from "./arithmetic/naturalLog";
import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function naturalLog(value: FixedPrecisionValue): FixedPrecisionLike {
  return fromContextValue(value, natural_log_value);
}

registerFunction("naturalLog", naturalLog);
