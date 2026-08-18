import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { get_denominator } from "./fractions/getDenominator";

export function getDenominator(value: FixedPrecisionValue): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value]);
  const denominator = get_denominator(
    FixedPrecision.toScaled(value, ctx),
    ctx.SCALE,
  );
  return FixedPrecision.fromRawWithContext(denominator * ctx.SCALE, ctx);
}
