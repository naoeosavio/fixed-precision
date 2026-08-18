import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function getNumerator(value: FixedPrecisionValue): FixedPrecision {
  return new FixedPrecision(value).num();
}
