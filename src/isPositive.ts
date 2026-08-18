import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { isPositiveValue } from "./logical/isPositive";

export function isPositive(value: FixedPrecisionValue): boolean {
  const ctx = FixedPrecision.resolveContext([value]);
  return isPositiveValue(FixedPrecision.toScaled(value, ctx));
}
