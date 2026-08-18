import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { lessThanOrEqualValue } from "./relational/lessThanOrEqual";

export function lessThanOrEqual(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = FixedPrecision.resolveContext([left, right]);
  return lessThanOrEqualValue(
    FixedPrecision.toScaled(left, ctx),
    FixedPrecision.toScaled(right, ctx),
  );
}
