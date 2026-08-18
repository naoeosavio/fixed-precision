import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { acoth_value } from "./trigonometry/acoth";

export function acoth(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, acoth_value);
}
