import { logicalXorValues } from "../../core/logical/logicalXor";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function logicalXor(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return logicalXorValues(toScaled(left, ctx), toScaled(right, ctx));
}
