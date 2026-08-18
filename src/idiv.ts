import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function idiv(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): FixedPrecision {
  const ctx = FixedPrecision.resolveContext([value, other]);
  return FixedPrecision.fromRawWithContext(
    (FixedPrecision.toScaled(value, ctx) /
      FixedPrecision.toScaled(other, ctx)) *
      ctx.SCALE,
    ctx,
  );
}
