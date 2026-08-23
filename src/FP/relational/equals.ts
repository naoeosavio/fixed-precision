import { equalsValue } from "../../core/relational/equals";
import {
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function equals(
  left: FixedPrecisionOperand,
  right: FixedPrecisionOperand,
): boolean {
  const ctx = resolveContext([left, right]);
  return equalsValue(toScaled(left, ctx), toScaled(right, ctx));
}
