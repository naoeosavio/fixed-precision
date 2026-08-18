import type { FixedPrecisionValue } from "./FixedPrecision";
import FixedPrecision from "./FixedPrecision";

export function divmod(
  value: FixedPrecisionValue,
  other: FixedPrecisionValue,
): { quotient: FixedPrecision; remainder: FixedPrecision } {
  const ctx = FixedPrecision.resolveContext([value, other]);
  const raw = FixedPrecision.toScaled(value, ctx);
  const otherRaw = FixedPrecision.toScaled(other, ctx);
  const quotient = FixedPrecision.fromRawWithContext(
    (raw * ctx.SCALE) / otherRaw,
    ctx,
  );

  return {
    quotient,
    remainder: FixedPrecision.fromRawWithContext(
      raw - (quotient.raw() * otherRaw) / ctx.SCALE,
      ctx,
    ),
  };
}
