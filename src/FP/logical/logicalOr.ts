import { logicalOrValues } from "../../core/logical/logicalOr";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function logicalOr(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalOrValues(toScaled(left, ctx), toScaled(right, ctx));
}
