import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { greaterThanOrEqualValue } from "./relational/greaterThanOrEqual";

export function greaterThanOrEqual(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = FixedPrecision.resolveContext([left, right]);
  return greaterThanOrEqualValue(
    FixedPrecision.toScaled(left, ctx),
    FixedPrecision.toScaled(right, ctx),
  );
}
