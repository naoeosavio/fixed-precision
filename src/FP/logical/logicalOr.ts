import { logicalOrValues } from "../../core/logical/logicalOr";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function logicalOr(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return logicalOrValues(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return logicalOrValues(toScaled(left, ctx), toScaled(right, ctx));
}
