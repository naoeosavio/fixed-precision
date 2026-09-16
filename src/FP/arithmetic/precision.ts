import { significant_digits_value } from "../../core/arithmetic/significantDigits";
import {
  type FixedPrecisionOperand,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function precision(
  value: FixedPrecisionOperand,
  includeZeros = false,
): number {
  const ctx = resolveContextSingle(value);
  return significant_digits_value(toScaled(value, ctx), ctx, includeZeros);
}

export function precisionBy(includeZeros = false) {
  return (value: FixedPrecisionOperand): number =>
    precision(value, includeZeros);
}
