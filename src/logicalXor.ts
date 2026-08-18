import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { logicalXorValues } from "./logical/logicalXor";

export function logicalXor(
  left: FixedPrecisionValue,
  right: FixedPrecisionValue,
): boolean {
  const ctx = FixedPrecision.resolveContext([left, right]);
  return logicalXorValues(
    FixedPrecision.toScaled(left, ctx),
    FixedPrecision.toScaled(right, ctx),
  );
}
