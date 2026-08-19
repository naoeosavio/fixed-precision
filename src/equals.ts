import { registerFunction, resolveContext, toScaled } from "./core/value";
import { equalsValue } from "./relational/equals";
import type { FixedPrecisionValue } from "./types";

export function equals(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = resolveContext([left, right]);
  return equalsValue(toScaled(left, ctx), toScaled(right, ctx));
}

registerFunction("equals", equals);
