import { registerFunction, resolveContext, toScaled } from "./core/value";
import { isNegativeValue } from "./logical/isNegative";
import type { FixedPrecisionValue } from "./types";

export function isNegative(value: FixedPrecisionValue): boolean {
  const ctx = resolveContext([value]);
  return isNegativeValue(toScaled(value, ctx));
}

registerFunction("isNegative", isNegative);
