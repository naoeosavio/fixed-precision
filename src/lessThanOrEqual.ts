import { registerFunction, resolveContext, toScaled } from "./core/value";
import { lessThanOrEqualValue } from "./relational/lessThanOrEqual";
import type { FixedPrecisionValue } from "./types";

export function lessThanOrEqual(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return lessThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("lessThanOrEqual", lessThanOrEqual);
