import { registerFunction, resolveContext, toScaled } from "./core/value";
import { lessThanValue } from "./relational/lessThan";
import type { FixedPrecisionValue } from "./types";

export function lessThan(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return lessThanValue(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("lessThan", lessThan);
