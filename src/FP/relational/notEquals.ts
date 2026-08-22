import type { FixedPrecisionOperand } from "../../core/construction/types";
import { equals } from "./equals";

export function notEquals(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  return !equals(left, right);
}
