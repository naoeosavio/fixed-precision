import type {
  Comparison,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import { resolveContext, toScaled } from "../../core/construction/value";
import { compareValues } from "../../core/relational/compare";

export function compare(
  value: FixedPrecisionOperand,
  other: FixedPrecisionOperand,
): Comparison {
  const ctx = resolveContext([value, other]);
  return compareValues(toScaled(value, ctx), toScaled(other, ctx));
}
