import { registerFunction, resolveContext, toScaled } from "./core/value";
import { greaterThanValue } from "./relational/greaterThan";
import type { FixedPrecisionValue } from "./types";

export function greaterThan(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return greaterThanValue(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("greaterThan", greaterThan);
