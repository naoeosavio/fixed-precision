import { logicalAndValues } from "../../core/logical/logicalAnd";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function logicalAnd(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalAndValues(toScaled(left, ctx), toScaled(right, ctx));
}
