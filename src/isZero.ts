import { registerFunction, resolveContext, toScaled } from "./core/value";
import { isZeroValue } from "./logical/isZero";
import type { FixedPrecisionValue } from "./types";

export function isZero(value: FixedPrecisionValue): boolean {
  const ctx = resolveContext([value]);
  return isZeroValue(toScaled(value, ctx));
}

registerFunction("isZero", isZero);
