import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function isPositive(value: FixedPrecisionValue): boolean {
  return new FixedPrecision(value).isPositive();
}
