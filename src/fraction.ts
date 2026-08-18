import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { fraction_value } from "./fractions/fraction";

export function fraction(
  value: FixedPrecisionValue,
  maxDen?: FixedPrecisionValue,
): [FixedPrecision, FixedPrecision] {
  const ctx = FixedPrecision.resolveContext([value]);
  const raw = FixedPrecision.toScaled(value, ctx);
  const result =
    maxDen === undefined
      ? fraction_value(raw, ctx.SCALE)
      : fraction_value(
          raw,
          ctx.SCALE,
          FixedPrecision.normalizeTo(maxDen, ctx).scale(0, 1).raw(),
        );

  return [
    FixedPrecision.fromRawWithContext(result.numerator * ctx.SCALE, ctx),
    FixedPrecision.fromRawWithContext(result.denominator * ctx.SCALE, ctx),
  ];
}
