import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function hypot(
  value?: FixedPrecisionValue | FixedPrecisionValue[],
  ...values: FixedPrecisionValue[]
): FixedPrecision {
  return FixedPrecision.hypot(value, ...values);
}
