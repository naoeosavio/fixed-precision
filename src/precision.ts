import { significant_digits_value } from "./arithmetic/significantDigits";
import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function precision(
  value: FixedPrecisionValue,
  includeZeros = false,
): number {
  const ctx = FixedPrecision.resolveContext([value]);
  return significant_digits_value(
    FixedPrecision.toScaled(value, ctx),
    ctx,
    includeZeros,
  );
}
