import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { isZeroValue } from "./logical/isZero";

export function isZero(value: FixedPrecisionValue): boolean {
  const ctx = FixedPrecision.resolveContext([value]);
  return isZeroValue(FixedPrecision.toScaled(value, ctx));
}
