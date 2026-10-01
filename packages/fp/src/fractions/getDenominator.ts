import { get_denominator } from "../../../core/src/core/fractions/getDenominator";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function getDenominator(
  value: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContextSingle(value);
  const denominator = get_denominator(toScaled(value, ctx), ctx.SCALE);
  return fromRawWithContext(denominator * ctx.SCALE, ctx);
}
