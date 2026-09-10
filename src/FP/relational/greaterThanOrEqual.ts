import { greaterThanOrEqualValue } from "../../core/relational/greaterThanOrEqual";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function greaterThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return greaterThanOrEqualValue(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return greaterThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}
