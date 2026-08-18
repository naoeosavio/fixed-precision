import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function fraction(
  value: FixedPrecisionValue,
  maxDen?: FixedPrecisionValue,
): [FixedPrecision, FixedPrecision] {
  return new FixedPrecision(value).fraction(maxDen);
}
