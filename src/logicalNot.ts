import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function logicalNot(value: FixedPrecisionValue): boolean {
  return FixedPrecision.not(value);
}
