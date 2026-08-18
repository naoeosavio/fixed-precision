import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { asech_value } from "./trigonometry/asech";

export function asech(value: FixedPrecisionValue): FixedPrecision {
  return FixedPrecision.fromContextValue(value, asech_value);
}
