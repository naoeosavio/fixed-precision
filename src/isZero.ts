import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function isZero(value: FixedPrecisionValue): boolean {
  return new FixedPrecision(value).isZero();
}
