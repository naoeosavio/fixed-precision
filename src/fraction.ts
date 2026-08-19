import {
  fromRawWithContext,
  normalizeTo,
  registerFunction,
  resolveContext,
  toScaled,
} from "./core/value";
import { fraction_value } from "./fractions/fraction";
import type { FixedPrecisionLike, FixedPrecisionValue } from "./types";

export function fraction(
  value: FixedPrecisionValue,
  maxDen?: FixedPrecisionValue,
): [FixedPrecisionLike, FixedPrecisionLike] {
  const ctx = resolveContext([value]);
  const raw = toScaled(value, ctx);
  const result =
    maxDen === undefined
      ? fraction_value(raw, ctx.SCALE)
      : fraction_value(
          raw,
          ctx.SCALE,
          normalizeTo(maxDen, ctx).scale(0, 1).raw(),
        );

  return [
    fromRawWithContext(result.numerator * ctx.SCALE, ctx),
    fromRawWithContext(result.denominator * ctx.SCALE, ctx),
  ];
}

registerFunction("fraction", fraction);
