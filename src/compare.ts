import { registerFunction, resolveContext, toScaled } from "./core/value";
import { compareValues } from "./relational/compare";
import type { Comparison, FixedPrecisionValue } from "./types";

export function compare(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): Comparison {
  const ctx = resolveContext([value, other]);
  return compareValues(toScaled(value, ctx), toScaled(other, ctx));
}

registerFunction("compare", compare);
