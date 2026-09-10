import { equalsValue } from "../../core/relational/equals";
import {
  type FixedPrecisionOperand,
  isFixedPrecisionData,
  resolveContextPair,
  toScaled,
} from "../construction";

export function equals(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  if (
    isFixedPrecisionData(left) &&
    isFixedPrecisionData(right) &&
    left.places === right.places &&
    left.roundingMode === right.roundingMode
  ) {
    return equalsValue(left.value, right.value);
  }
  const ctx = resolveContextPair(left, right);
  return equalsValue(toScaled(left, ctx), toScaled(right, ctx));
}
