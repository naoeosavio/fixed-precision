import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { greaterThanValue } from "./relational/greaterThan";

export function greaterThan(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = FixedPrecision.resolveContext([left, right]);
  return greaterThanValue(
    FixedPrecision.toScaled(left, ctx),
    FixedPrecision.toScaled(right, ctx),
  );
}
