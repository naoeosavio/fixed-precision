import type { FixedPrecisionOperand } from "../../core/construction/types";
import { precision } from "./precision";

export function significantDigits(
  value: FixedPrecisionOperand,
  includeZeros = false,
): number {
  return precision(value, includeZeros);
}
