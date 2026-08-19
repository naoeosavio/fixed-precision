import { registerFunction, resolveContext, toScaled } from "./core/value";
import { logicalAndValues } from "./logical/logicalAnd";
import type { FixedPrecisionValue } from "./types";

export function logicalAnd(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalAndValues(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("logicalAnd", logicalAnd);
