import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";
import { get_denominator } from "../../core/fractions/getDenominator";

export function getDenominator(
  value: FixedPrecisionOperand,
): FixedPrecisionData {
  const ctx = resolveContext([value]);
  const denominator = get_denominator(toScaled(value, ctx), ctx.SCALE);
  return fromRawWithContext(denominator * ctx.SCALE, ctx);
}
