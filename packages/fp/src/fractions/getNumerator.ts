import { get_numerator } from "../../../core/src/core/fractions/getNumerator";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function getNumerator(value: FixedPrecisionOperand): FixedPrecisionData {
  const ctx = resolveContextSingle(value);
  const numerator = get_numerator(toScaled(value, ctx), ctx.SCALE);
  return fromRawWithContext(numerator * ctx.SCALE, ctx);
}
