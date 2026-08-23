import { lessThanOrEqualValue } from "../../core/relational/lessThanOrEqual";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function lessThanOrEqual(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return lessThanOrEqualValue(toScaled(left, ctx), toScaled(right, ctx));
}
