import { registerFunction, resolveContext, toScaled } from "./core/value";
import { logicalOrValues } from "./logical/logicalOr";
import type { FixedPrecisionValue } from "./types";

export function logicalOr(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalOrValues(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("logicalOr", logicalOr);
