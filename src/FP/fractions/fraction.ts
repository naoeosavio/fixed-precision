import { scale_value } from "../../core/arithmetic/scale";
import { fraction_value } from "../../core/fractions/fraction";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  resolveContext,
  toScaled,
} from "../construction";

export function fraction(
  value: FixedPrecisionOperand,
  maxDen?: FixedPrecisionOperand,
): [FixedPrecisionData, FixedPrecisionData] {
  const ctx = resolveContext([value]);
  const raw = toScaled(value, ctx);
  const result =
    maxDen === undefined
      ? fraction_value(raw, ctx.SCALE)
      : fraction_value(
          raw,
          ctx.SCALE,
          scale_value(toScaled(maxDen, ctx), 0, 1, ctx),
        );

  return [
    fromRawWithContext(result.numerator * ctx.SCALE, ctx),
    fromRawWithContext(result.denominator * ctx.SCALE, ctx),
  ];
}
