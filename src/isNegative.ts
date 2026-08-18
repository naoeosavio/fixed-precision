import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { isNegativeValue } from "./logical/isNegative";

export function isNegative(value: FixedPrecisionValue): boolean {
  const ctx = FixedPrecision.resolveContext([value]);
  return isNegativeValue(FixedPrecision.toScaled(value, ctx));
}
