import { registerFunction, resolveContext, toScaled } from "./core/value";
import { greaterThanOrEqualValue } from "./relational/greaterThanOrEqual";
import type { FixedPrecisionValue } from "./types";

export function greaterThanOrEqual(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return greaterThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("greaterThanOrEqual", greaterThanOrEqual);
