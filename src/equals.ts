import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { equalsValue } from "./relational/equals";

export function equals(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = FixedPrecision.resolveContext([left, right]);
  return equalsValue(
    FixedPrecision.toScaled(left, ctx),
    FixedPrecision.toScaled(right, ctx),
  );
}
