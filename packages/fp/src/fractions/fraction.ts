import { scale_value } from "../../../core/src/core/arithmetic/scale";
import { fraction_value } from "../../../core/src/core/fractions/fraction";
import {
  type FixedPrecisionData,
  type FixedPrecisionOperand,
  fromRawWithContext,
  type MaxDenOptions,
  resolveContextSingle,
  toScaled,
} from "../construction";

export function fraction(
  value: FixedPrecisionOperand,
  options?: MaxDenOptions,
): [FixedPrecisionData, FixedPrecisionData] {
  const ctx = resolveContextSingle(value);
  const raw = toScaled(value, ctx);
  const maxDen = options?.maxDen;
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

export function fractionBy(options?: MaxDenOptions) {
  return (
    value: FixedPrecisionOperand,
  ): [FixedPrecisionData, FixedPrecisionData] => fraction(value, options);
}
