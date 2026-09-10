import { greaterThanValue } from "../../core/relational/greaterThan";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function greaterThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return greaterThanValue(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return greaterThanValue(toScaled(left, ctx), toScaled(right, ctx));
}
