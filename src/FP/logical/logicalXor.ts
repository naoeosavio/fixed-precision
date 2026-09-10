import { logicalXorValues } from "../../core/logical/logicalXor";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function logicalXor(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return logicalXorValues(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return logicalXorValues(toScaled(left, ctx), toScaled(right, ctx));
}
