import { lessThanValue } from "../../core/relational/lessThan";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function lessThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return lessThanValue(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return lessThanValue(toScaled(left, ctx), toScaled(right, ctx));
}
