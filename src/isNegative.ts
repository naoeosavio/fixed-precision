import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function isNegative(value: FixedPrecisionValue): boolean {
  return new FixedPrecision(value).isNegative();
}
