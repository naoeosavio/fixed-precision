import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function neg(value: FixedPrecisionValue): FixedPrecision {
  return new FixedPrecision(value).neg();
}
