import { significant_digits_value } from "../../core/arithmetic/significantDigits";
import type { FixedPrecisionOperand } from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";

export function precision(
  value: FixedPrecisionOperand,
  includeZeros = false,
): number {
  const ctx = resolveContext([value]);
  return significant_digits_value(toScaled(value, ctx), ctx, includeZeros);
}
