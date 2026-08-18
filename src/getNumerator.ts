import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";
import { get_numerator } from "./fractions/getNumerator";

export function getNumerator(value: FixedPrecisionValue): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value]);
  const numerator = get_numerator(
    FixedPrecision.toScaled(value, ctx),
    ctx.SCALE,
  );
  return FixedPrecision.fromRawWithContext(numerator * ctx.SCALE, ctx);
}
