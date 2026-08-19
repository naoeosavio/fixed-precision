import { significant_digits_value } from "./arithmetic/significantDigits";
import { registerFunction, resolveContext, toScaled } from "./core/value";
import type { FixedPrecisionValue } from "./types";

export function precision(
  value: FixedPrecisionValue,
  includeZeros = false,
): number {
  const ctx = resolveContext([value]);
  return significant_digits_value(toScaled(value, ctx), ctx, includeZeros);
}

registerFunction("precision", precision);
