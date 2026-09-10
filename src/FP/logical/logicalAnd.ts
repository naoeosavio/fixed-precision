import { logicalAndValues } from "../../core/logical/logicalAnd";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function logicalAnd(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return logicalAndValues(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return logicalAndValues(toScaled(left, ctx), toScaled(right, ctx));
}
