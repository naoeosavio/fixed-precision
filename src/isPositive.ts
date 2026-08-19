import { registerFunction, resolveContext, toScaled } from "./core/value";
import { isPositiveValue } from "./logical/isPositive";
import type { FixedPrecisionValue } from "./types";

export function isPositive(value: FixedPrecisionValue): boolean {
  const ctx = resolveContext([value]);
  return isPositiveValue(toScaled(value, ctx));
}

registerFunction("isPositive", isPositive);
