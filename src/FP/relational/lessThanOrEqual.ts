import { lessThanOrEqualValue } from "../../core/relational/lessThanOrEqual";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function lessThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return lessThanOrEqualValue(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return lessThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}
