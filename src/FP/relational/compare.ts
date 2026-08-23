import { compareValues } from "../../core/relational/compare";
import {
  type Comparison,
  type FixedPrecisionOperand,
  resolveContext,
  toScaled,
} from "../construction";

export function compare(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): Comparison {
  const ctx = resolveContext([value, other]);
  return compareValues(toScaled(value, ctx), toScaled(other, ctx));
}
