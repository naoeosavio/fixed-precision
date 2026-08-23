import type { FixedPrecisionOperand } from "../construction";
import { precision } from "./precision";

export function significantDigits(
  value: FixedPrecisionOperand,
  includeZeros = false,
): number {
  return precision(value, includeZeros);
}
