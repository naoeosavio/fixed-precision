import { lessThanValue } from "../../core/relational/lessThan";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function lessThan(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return lessThanValue(toScaled(left, ctx), toScaled(right, ctx));
}
