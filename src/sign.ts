import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function sign(value: FixedPrecisionValue): number {
  return FixedPrecision.sign(value);
}
