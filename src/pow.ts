import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function pow(value: FixedPrecisionValue, exp: number): FixedPrecision {
  return FixedPrecision.pow(value, exp);
}
