import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { acosh_value } from "./trigonometry/acosh";

export function acosh(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, acosh_value);
}
