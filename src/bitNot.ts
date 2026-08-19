import { fromContextValue, registerFunction } from "./core/value";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function bitNot(value: FixedPrecisionValue): FixedPrecisionLike {
  // biome-ignore lint/suspicious/noBitwiseOperators: operação bitwise intencional
  return fromContextValue(value, (raw) => ~raw);
}

registerFunction("bitNot", bitNot);
