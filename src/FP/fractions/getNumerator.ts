import type {
  FixedPrecisionData,
  FixedPrecisionOperand,
} from "../../core/construction/types";
import {
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../../core/construction/value";
import { get_numerator } from "../../core/fractions/getNumerator";

export function getNumerator(value: FixedPrecisionOperand): FixedPrecisionData {
  const ctx = resolveContext([value]);
  const numerator = get_numerator(toScaled(value, ctx), ctx.SCALE);
  return fromRawWithContext(numerator * ctx.SCALE, ctx);
}
